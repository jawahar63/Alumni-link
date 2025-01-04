import fs from "fs";
import path from "path";
import User from "../models/user.js";
import { v4 as uuidv4 } from "uuid";
import multer from 'multer';
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";
import Post from "../models/post.js"
import {PDFDocument} from "pdf-lib"
import sharp from "sharp"
import mongoose from "mongoose";
import {io} from "../index.js";
import { populate } from "dotenv";
import cloudinary from '../utils/cloudinary.js';

export const createPost = async (req, res, next) => {
  try {
    const { author, caption, tags, location } = req.body;

    const user = await User.findById(author).populate(
      'username email batch domain company profileImage'
    );
    if (!user) {
      return next(CreateError(404, 'User not found'));
    }

    // Upload files to Cloudinary
    const mediaFiles = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'post_media',
        });
        mediaFiles.push({
          type: 'image', // Adjust for other types later
          url: result.secure_url,
        });
        fs.unlinkSync(file.path); // Remove the file from local storage after upload
      }
    }

    // Handle tags
    const tagsArray = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((tag) => tag.trim())
      : [];

    const newPost = new Post({
      author,
      media: mediaFiles,
      caption,
      tags: tagsArray,
      location,
    });
    await newPost.save();
        io.emit('newPost',newPost);
        next(CreateSuccess(200, "Post created successfully"));
    } catch (error) {
        console.log(error);
        next(CreateError(500, "Something went wrong"));
    }
};

export const updatePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { author, caption, tags, location, existingMedia } = req.body;

    // Verify author existence
    const user = await User.findById(author).populate(
      'username email batch domain company profileImage'
    );
    if (!user) {
      return next(CreateError(404, 'User not found'));
    }

    // Get the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return next(CreateError(404, 'Post not found'));
    }

    if (!post.author.equals(author)) {
      return next(CreateError(403, 'Unauthorized to update this post'));
    }

    // Handle new media files (if any)
    let mediaFiles = post.media || [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'post_media',
        });
        mediaFiles.push({
          type: 'image',
          url: result.secure_url,
        });
        fs.unlinkSync(file.path); // Remove the file from local storage after upload
      }
    }

    // Handle media removal from the database (without deleting Cloudinary files)
    if (existingMedia && Array.isArray(existingMedia)) {
      mediaFiles = mediaFiles.filter((media) => existingMedia.includes(media.url));
    }

    // Update post fields
    post.caption = caption || post.caption;
    post.tags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((tag) => tag.trim())
      : post.tags;
    post.location = location || post.location;
    post.media = mediaFiles;

    // Save updated post
        await post.save();
        io.emit('editPost',{postId,post});
        return next(CreateSuccess(200, "Post updated successfully"));
    } catch (error) {
        console.error(error);
        return next(CreateError(500, "Something went wrong"));
    }
};
export const getPostById = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId)
            .populate('author', 'username email batch domain company profileImage')
            .populate({
                path: 'comments',
                populate: {
                    path: 'commenter',
                    select: 'username profileImage',
                }
            }).populate({
                path:'likes',
                populate:{
                    path:'liker',
                    select:'username profileImage',
                }
            });

        if (!post) {
            return next(CreateError(404, "Post not found"));
        }


        return next(CreateSuccess(200, "Post retrieved successfully", post));
    } catch (error) {
        return next(CreateError(500, "Something went wrong"));
    }
};
export const getAllPosts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find()
            .populate({
                path: 'author',
                select: 'username email batch domain company profileImage',
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'commenter',
                    select: 'username profileImage',
                }
            }).populate({
                path:'likes',
                populate:{
                    path:'liker',
                    select:'username profileImage',
                }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPosts = await Post.countDocuments();


        return res.status(200).json({
            success: true,
            page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
            posts: posts
        });
    } catch (error) {
        console.error(error);
        return next(CreateError(500, "Something went wrong"));
    }
};

export const getPostsByAuthor = async (req, res, next) => {
    try {
        const { authorId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find({ author: authorId })
            .populate('author', 'username email batch domain company profileImage')
            .populate({
                path: 'comments',
                populate: {
                    path: 'commenter',
                    select: 'username profileImage',
                }
            }).populate({
                path:'likes',
                populate:{
                    path:'liker',
                    select:'username profileImage',
                }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPosts = await Post.countDocuments({ author: authorId });


        return res.status(200).json({
            success: true,
            page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
            posts: posts
        });
    } catch (error) {
        console.error(error);
        return next(CreateError(500, "Something went wrong"));
    }
};

export const filterPosts = async (req, res, next) => {
    try {
        const { author, tags, location, startDate, endDate } = req.query;

        let filter = {};

        if (author) {
            filter.author = author;
        }

        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }

        if (tags) {
            const tagArray = tags.split(',').map(tag => tag.trim());
            filter.tags = { $in: tagArray };
        }

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find(filter)
            .populate('author', 'username email batch domain company profileImage').populate({
                path:'likes',
                populate:{
                    path:'liker',
                    select:'username profileImage',
                }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPosts = await Post.countDocuments(filter);

        return res.status(200).json({
            success: true,
            page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
            posts: posts
        });
    } catch (error) {
        console.error(error);
        return next(CreateError(500, "Something went wrong"));
    }
};

export const AddComment = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { userid, text } = req.body;

        if (!userid || !text) {
            return next(CreateError(400, 'User ID and comment text are required'));
        }

        const user = await User.findById(userid);
        if (!user) {
            return next(CreateError(404, 'User not found'));
        }

        const post = await Post.findById(postId);
        if (!post) {
            return next(CreateError(404, 'Post not found'));
        }
        const newComment = {
            commenter: userid,
            text,
            createdAt: new Date()
        };
        post.comments.push(newComment);

        await post.save();

        const lastComment = post.comments[post.comments.length - 1];

        const populatedComment = await Post.populate(lastComment, {
            path: 'commenter',
            select: 'username profileImage'
        });


        io.emit("newComment", { postId: post._id, comment: populatedComment,authorId: post.author,postId:post._id  });
        return res.status(200).json({
            status: 'success',
            message: 'Comment added successfully',
            data: populatedComment
        });
    } catch (error) {
        console.error(error);
        return next(CreateError(500, 'Something went wrong while adding the comment'));
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const { postId, commentId } = req.params;
        const { userid } = req.body;
        if (!userid) {
            return next(CreateError(400, 'User ID is required'));
        }

        // Find the post where the comment will be deleted
        const post = await Post.findById(postId);
        if (!post) {
            
            return next(CreateError(404, 'Post not found'));
        }

        // Find the comment to delete
        const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId && (comment.commenter.toString() === userid||post._id===userid));
        if (commentIndex === -1) {
            return next(CreateError(404, 'Comment not found or you are not authorized to delete this comment'));
        }

        // Remove the comment from the post's comments array
        post.comments.splice(commentIndex, 1);

        // Save the updated post
        await post.save();

        const updatedpost = await Post.findById(postId).populate({
            path:'comments',
            populate:{
                path:'commenter',
                select:'username profileImage'
            }
        });
        io.emit('deleteComment',{postId,comments:updatedpost.comments});

        // Send success response
        return res.status(200).json({
            status: 'success',
            message: 'Comment deleted successfully'
        });
    } catch (error) {
        console.error(error);
        return next(CreateError(500, 'Something went wrong while deleting the comment'));
    }
};
export const editComment = async (req, res, next) => {
    try {
        const { postId, commentId } = req.params;
        const { userid, newText } = req.body;

        // Ensure userId and newText are provided
        if (!userid || !newText) {
            return next(CreateError(400, 'User ID and new comment text are required'));
        }

        // Find the post where the comment will be edited
        const post = await Post.findById(postId);
        if (!post) {
            return next(CreateError(404, 'Post not found'));
        }

        // Find the comment to edit
        const comment = post.comments.id(commentId);
        if (!comment || comment.commenter.toString() !== userid) {
            return next(CreateError(404, 'Comment not found or you are not authorized to edit this comment'));
        }

        // Update the comment text
        comment.text = newText;
        comment.createdAt = new Date(); // Optional: add an updatedAt field if you have one

        // Save the updated post
        await post.save();

        io.emit('editComment',{postId,commentId,comment});
        return res.status(200).json({
            status: 'success',
            message: 'Comment updated successfully',
            data: comment
        });
    } catch (error) {
        console.error(error);
        return next(CreateError(500, 'Something went wrong while editing the comment'));
    }
};
export const AddLike = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { userid } = req.body;
        const post = await Post.findById(postId).populate({
                path: 'likes',
                populate: {
                    path: 'liker',
                    select: 'username profileImage',
                }
            });
        const user = await User.findById(userid);

        // Check if post exists
        if (!post) {
            return next(CreateError(404, 'Post not found'));
        }

        // Check if user exists
        if (!user) {
            return next(CreateError(400, 'User is required'));
        }

        // Convert userid to ObjectId
        const userIdObj = new mongoose.Types.ObjectId(userid);

        const likedIndex = post.likes.findIndex(like => {
            // Check if liker is populated and has an _id
            if (like.liker && like.liker._id) {
                return like.liker._id.equals(userIdObj);
            }
            return false;
        });
        if (likedIndex !== -1) {
            post.likes.splice(likedIndex, 1);
            await post.save();
            io.emit('newLike', { postId, likes: post.likes });
            return next(CreateSuccess(200, 'Like removed successfully'));
        } else {
            // User has not liked the post, so add the like
            const like = {
                liker: userIdObj, // Use ObjectId directly
                likedAt: new Date(),
            };
            post.likes.push(like);
            await post.save();
            const lastlike = post.likes[post.likes.length - 1];
            const updatedLikes=await Post.populate(lastlike,{
                path:'liker',
                select:'username profileImage',
            });
            io.emit('newLike', { postId, likes: post.likes,authorId:post.author,like:lastlike,postId:post._id });
            return next(CreateSuccess(200, 'Liked successfully'));
        }

    } catch (error) {
        console.log(error);
        return next(CreateError(500, 'Something went wrong while adding/removing the like'));
    }
}

export const getComments = async (req, res, next) => {
    try {
        const { postId } = req.params;

        // Find the post by its ID and populate author details inside comments
        const post = await Post.findById(postId)
            .populate({
                path: 'comments',
                populate: {
                    path: 'commenter',
                    select: 'username profileImage',
                }
            });// Populate with only username and profileImage

        if (!post) {
            return next(CreateError(404, 'Post not found'));
        }
        const comments = post.comments.map(comment => ({
            commenter: comment.commenter ? {
                username: comment.commenter.username,
                profileImage: comment.commenter.profileImage
            } : { username: 'Unknown', profileImage: '' }, // Handle missing commenter
            text: comment.text || '', // Ensure this matches the field name in your schema
            createdAt: comment.createdAt
        }));

        // Return all comments of the post with author details
        return next(CreateSuccess(200, 'Comments retrieved successfully', comments));
    } catch (error) {
        console.error(error);
        return next(CreateError(500, 'Something went wrong while retrieving comments'));
    }
};
export const getLikes = async (req, res, next) => {
    try {
        const { postId } = req.params;

        // Find the post by its ID and populate user details in the likes array
        const post = await Post.findById(postId)
            .populate('likes', 'username profileImage'); // Populate likes with username and profileImage

        if (!post) {
            return next(CreateError(404, 'Post not found'));
        }
        return next(CreateSuccess(200, 'Likes retrieved successfully', post.likes));
    } catch (error) {
        console.error(error);
        return next(CreateError(500, 'Something went wrong while retrieving likes'));
    }
};

const deleteMediaFiles = async (media) => {
  try {
    for (const file of media) {
      const publicId = file.url.split('/').pop().split('.')[0]; // Extract public ID from the URL
      await cloudinary.uploader.destroy(`post_media/${publicId}`);
    }
  } catch (error) {
    console.error("Error deleting media files from Cloudinary:", error);
    throw new Error("Failed to delete media files");
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return next(CreateError(404, "Post not found"));
    }

    // Delete media files from Cloudinary
    if (post.media && post.media.length > 0) {
      await deleteMediaFiles(post.media);
    }

    // Delete the post from the database
    await Post.findByIdAndDelete(postId);

    // Emit the deletion event to connected clients
    io.emit('deletePost', postId);

    // Respond with success
    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return next(CreateError(500, "Something went wrong"));
  }
};
