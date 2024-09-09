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
        console.log('Uploaded files:', req.files);

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

            const BASE_URL = process.env.BASE_URL;
            return { type: 'image', url: `${BASE_URL}uploads/post/${uniqueName}` };
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
                    
                    const BASE_URL = process.env.BASE_URL;
                return { type: 'image', url: `${BASE_URL}uploads/post/${uniqueName}` };
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
export const getPostById =async (req,res,next)=>{
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId).populate('author', 'username email batch domain company');
        if (!post) {
            return next(CreateError(404, "Post not found"));
        }

        return next(CreateSuccess(200, "Post retrieved successfully", post));
    } catch (error) {
        return next(CreateError(404, "Something went wrong"));
    }
}
export const getAllPosts = async (req, res, next) => {
    try {
        // You can implement pagination here if needed
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 posts per page
        const skip = (page - 1) * limit;

        // Fetch posts from the database with pagination
        const posts = await Post.find()
            .populate('author', 'username email batch domain company') // Populate author field to include their details (e.g., username, email)
            .sort({ createdAt: -1 }) // Sort by creation date, newest first
            .skip(skip)
            .limit(limit);

        // Get the total count of posts for pagination info
        const totalPosts = await Post.countDocuments();

        return res.status(200).json({
            success: true,
            page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
            posts
        });
    } catch (error) {
        console.error(error);
        return next(CreateError(500, "Something went wrong"));
    }
};
export const getPostsByAuthor = async (req, res, next) => {
    try {
        const { authorId } = req.params; // Get the author's ID from the request parameters

        // You can implement pagination if needed
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 posts per page
        const skip = (page - 1) * limit;

        // Fetch posts by author ID with pagination
        const posts = await Post.find({ author: authorId })
            .populate('author', 'username email batch domain company') // Populate author field to include their details
            .sort({ createdAt: -1 }) // Sort by creation date, newest first
            .skip(skip)
            .limit(limit);

        // Get the total count of posts by this author
        const totalPosts = await Post.countDocuments({ author: authorId });

        return res.status(200).json({
            success: true,
            page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
            posts
        });
    } catch (error) {
        console.error(error);
        return next(CreateError(500, "Something went wrong"));
    }
};
export const filterPosts = async (req, res, next) => {
    try {
        // Get query parameters for filtering
        const { author, tags, location, startDate, endDate } = req.query;

        // Initialize an empty filter object
        let filter = {};

        // Add author to filter if provided
        if (author) {
            filter.author = author;
        }

        // Add location to filter if provided
        if (location) {
            filter.location = { $regex: location, $options: 'i' }; // Case-insensitive search
        }

        // Add tags to filter if provided (assuming tags is a comma-separated string)
        if (tags) {
            const tagArray = tags.split(',').map(tag => tag.trim());
            filter.tags = { $in: tagArray };
        }

        // Add date range filtering if startDate and/or endDate are provided
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        // Implement pagination if needed
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Fetch posts based on the filter
        const posts = await Post.find(filter)
            .populate('author', 'username email batch domain company')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get total count of posts that match the filter
        const totalPosts = await Post.countDocuments(filter);

        return res.status(200).json({
            success: true,
            page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
            posts
        });
    } catch (error) {
        console.error(error);
        return next(CreateError(500, "Something went wrong"));
    }
};
export const Addcomment =async(req,res,next)=>{
    try {
        const {postId} = req.params;
        const {user,text} = req.body;
        if (!user || !text) {
            return next(CreateError(400, 'Author and comment text are required'));
        }
        const Post = await Post.findById(postId);
        if(!Post){
            return next(CreateError(404, 'Post not found'));
        }

        const newComment ={
            user,
            text,
            createdAt: new Date(),
        };
        Post.comments.push(newComment);
        await Post.save();
        return next(CreateSuccess(200, 'Comment added successfully'));

    } catch (error) {
        return next(CreateError(500, 'Something went wrong while adding the comment'));
    }
    
}
export const Addlike =async(req,res,next)=>{
    try {
        const {postId} =req.params;
        const {user} = req.body;

        if(!user){
            return next(CreateError(400, 'Author is required'));
        }

        const Post = await Post.findById(postId);
        if(!Post){
            return next(CreateError(404, 'Post not found'));
        }

        const like={
            user,
            likedAt: new Date(),
        };

        Post.likes.push(like);
        await Post.save();

        return next(CreateSuccess(200, 'liked successfully'));
    } catch (error) {
        return next(CreateError(500, 'Something went wrong while adding the like'))
    }
}
export const getComments = async (req, res, next) => {
    try {
        const { postId } = req.params;

        // Find the post by its ID and populate author details inside comments
        const post = await Post.findById(postId)
            .populate('comments.author', 'username profileImage'); // Populate with only username and profileImage

        if (!post) {
            return next(CreateError(404, 'Post not found'));
        }

        // Return all comments of the post with author details
        return next(CreateSuccess(200, 'Comments retrieved successfully', post.comments));
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