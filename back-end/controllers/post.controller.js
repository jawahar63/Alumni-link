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

export const createPost= async (req, res, next) => {
    try {
        console.log('Uploaded files:', req.files);

        const { author, caption, tags, location } = req.body;
        const user = await User.findById(author);
        if(!user){
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
                    width: 800,  // Width for 4:5 ratio (width 800, height 1000)
                    height: 1000,
                    fit: sharp.fit.cover, // Ensures the image is cropped to cover the whole area
                    position: sharp.strategy.entropy // Focus on the most important part of the image
                })
                .toFile(outputPath);

            // Remove the original file
            fs.unlinkSync(file.path);
            const BASE_URL = process.env.BASE_URL;

            return { type: 'image', url: `${BASE_URL}uploads/post/${uniqueName}` };
        }));

        const newPost = new Post({
            author,
            media: mediaFiles,
            caption,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
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
        const { id } = req.params;
        const { author, caption, tags, location, existingMedia } = req.body;
        
        // Check if the user exists
        const user = await User.findById(author);
        if (!user) {
            return next(CreateError(404, "User not found"));
        }

        // Get the post by ID
        const post = await Post.findById(id);
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
                        width: 800, // 4:5 ratio (800x1000)
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
