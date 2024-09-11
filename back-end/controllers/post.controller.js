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

const __dirname = path.resolve();
const upload = multer({ dest: 'uploads/post/' });
const uploadsDir = path.join(__dirname, 'uploads', 'post');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const { promises: fsPromises } = fs;

export const createPost = async (req, res, next) => {
    try {

        const { author, caption, tags, location } = req.body;
        const user = await User.findById(author);
        if (!user) {
            return next(CreateError(404, "User not found"));
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        let mediaFiles = await Promise.all(req.files.map(async (file) => {
            if (!file.path) {
                console.error('File path is undefined:', file);
                throw new Error('File path is undefined');
            }

            const uniqueName = `${uuidv4()}-${path.basename(file.originalname)}`;
            const outputPath = path.join(uploadsDir, uniqueName);

            if (!fs.existsSync(file.path)) {
                console.error(`File not found: ${file.path}`);
                throw new Error(`File not found: ${file.path}`);
            }

            // Crop the image to a 4:5 aspect ratio using Sharp
            await sharp(file.path)
                .resize({
                    width: 1000,
                    height: 1000,
                    fit: sharp.fit.cover,
                    position: sharp.strategy.entropy
                })
                .toFile(outputPath);

            await fsPromises.unlink(file.path); // Use promises for unlinking
            return { type: 'image', url: `uploads/post/${uniqueName}` };
        }));

        // Handle tags
        const tagsArray = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : []);
        const newPost = new Post({
            author,
            media: mediaFiles,
            caption,
            tags: tagsArray,
            location
        });

        await newPost.save();
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
        
        // Check if the user exists
        const user = await User.findById(author);
        if (!user) {
            return next(CreateError(404, "User not found"));
        }

        // Get the post by ID
        const post = await Post.findById(postId);
        if (!post) {
            return next(CreateError(404, "Post not found"));
        }

        // Ensure the user has authorization to edit the post
        if (!post.author.equals(new mongoose.Types.ObjectId(author))) {
            return next(CreateError(403, "Unauthorized to update this post"));
        }

        // Handle new media files (if any)
        let mediaFiles = post.media || []; // Retain existing media if not removed
        if (req.files && req.files.length > 0) {
            const newMedia = await Promise.all(req.files.map(async (file) => {
                const uniqueName = `${uuidv4()}-${path.basename(file.originalname)}`;
                const outputPath = path.join(uploadsDir, uniqueName);

                // Crop the image to a 4:5 aspect ratio using Sharp
                await sharp(file.path)
                    .resize({
                        width: 1000, // 4:5 ratio (800x1000)
                        height: 1000,
                        fit: sharp.fit.cover,
                        position: sharp.strategy.entropy
                    })
                    .toFile(outputPath);
                    
                return { type: 'image', url: `uploads/post/${uniqueName}` };
            }));
            mediaFiles = mediaFiles.concat(newMedia); // Append new images to existing media
        }

        // Handle media removal from the database (without deleting the actual files)
        if (existingMedia && Array.isArray(existingMedia)) {
            mediaFiles = mediaFiles.filter(media => existingMedia.includes(media.url));
        }

        // Update post fields
        post.caption = caption || post.caption;
        post.tags = tags ? tags.split(',').map(tag => tag.trim()) : post.tags;
        post.location = location || post.location;
        post.media = mediaFiles;

        // Save updated post
        await post.save();
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
            });

        if (!post) {
            return next(CreateError(404, "Post not found"));
        }

        // Get the base URL from environment variables
        const BASE_URL = process.env.BASE_URL;
        if (!BASE_URL) {
            return next(CreateError(500, "BASE_URL is not defined"));
        }

        // Construct full URLs for media
        const postWithFullUrls = {
            ...post.toObject(),
            media: post.media.map(media => ({
                ...media,
                url: `${BASE_URL}${media.url}`
            }))
        };

        return next(CreateSuccess(200, "Post retrieved successfully", postWithFullUrls));
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
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPosts = await Post.countDocuments();

        // Get the base URL from environment variables
        const BASE_URL = process.env.BASE_URL;
        if (!BASE_URL) {
            return next(CreateError(500, "BASE_URL is not defined"));
        }

        // Construct full URLs for media
        const postsWithFullUrls = posts.map(post => ({
            ...post.toObject(),
            media: post.media.map(media => ({
                ...media,
                url: `${BASE_URL}${media.url}`
            }))
        }));

        return res.status(200).json({
            success: true,
            page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
            posts: postsWithFullUrls
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
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPosts = await Post.countDocuments({ author: authorId });

        // Get the base URL from environment variables
        const BASE_URL = process.env.BASE_URL;
        if (!BASE_URL) {
            return next(CreateError(500, "BASE_URL is not defined"));
        }

        // Construct full URLs for media
        const postsWithFullUrls = posts.map(post => ({
            ...post.toObject(),
            media: post.media.map(media => ({
                ...media,
                url: `${BASE_URL}${media.url}`
            }))
        }));

        return res.status(200).json({
            success: true,
            page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
            posts: postsWithFullUrls
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
            .populate('author', 'username email batch domain company profileImage')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPosts = await Post.countDocuments(filter);

        // Get the base URL from environment variables
        const BASE_URL = process.env.BASE_URL;
        if (!BASE_URL) {
            return next(CreateError(500, "BASE_URL is not defined"));
        }

        // Construct full URLs for media
        const postsWithFullUrls = posts.map(post => ({
            ...post.toObject(),
            media: post.media.map(media => ({
                ...media,
                url: `${BASE_URL}${media.url}`
            }))
        }));

        return res.status(200).json({
            success: true,
            page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
            posts: postsWithFullUrls
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

        // Ensure userId and text are provided
        if (!userid || !text) {
            return next(CreateError(400, 'User ID and comment text are required'));
        }

        // Find the user who is commenting
        const user = await User.findById(userid);
        if (!user) {
            return next(CreateError(404, 'User not found'));
        }

        // Find the post where the comment will be added
        const post = await Post.findById(postId);
        if (!post) {
            return next(CreateError(404, 'Post not found'));
        }

        // Create a new comment
        const newComment = {
            commenter: userid,
            text,
            createdAt: new Date()
        };

        // Add the new comment to the post's comments array
        post.comments.push(newComment);

        // Save the updated post
        await post.save();

        // Populate the comments with commenter details
        const populatedPost = await Post.findById(postId)
            .populate({
                path: 'comments.commenter',
                select: 'username profileImage'
            });

        // Send success response with populated comments
        return res.status(200).json({
            status: 'success',
            message: 'Comment added successfully',
            data: populatedPost.comments
        });
    } catch (error) {
        console.error(error);
        return next(CreateError(500, 'Something went wrong while adding the comment'));
    }
};
export const AddLike = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { userid } = req.body;

        // Find the post and user, and populate the likes.liker field
        const post = await Post.findById(postId).populate({
                path: 'likes',
                populate: {
                    path: 'liker',
                    select: '_id',
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
            return next(CreateSuccess(200, 'Like removed successfully'));
        } else {
            // User has not liked the post, so add the like
            const like = {
                liker: userIdObj, // Use ObjectId directly
                likedAt: new Date(),
            };

            post.likes.push(like);
            await post.save();
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
// Utility function to delete media files from the filesystem
const deleteMediaFiles = async (mediaFiles) => {
    const uploadsDir = path.join(__dirname, '../uploads/post'); // Adjust path as needed
    for (const media of mediaFiles) {
        const filePath = path.join(uploadsDir, path.basename(media.url));
        if (fs.existsSync(filePath)) {
            await fsPromises.unlink(filePath);
        }
    }
};

export const deletePost = async (req, res, next) => {
    try {
        const { postId } = req.params;

        // Find and delete the post
        const post = await Post.findById(postId);
        if (!post) {
            return next(CreateError(404, "Post not found"));
        }

        // Delete associated media files
        await deleteMediaFiles(post.media);

        // Remove the post from the database
        await Post.findByIdAndDelete(postId);

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });
    } catch (error) {
        console.error(error);
        return next(CreateError(500, "Something went wrong"));
    }
};
