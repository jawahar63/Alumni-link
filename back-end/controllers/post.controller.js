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

const __dirname = path.resolve();
const upload = multer({ dest: 'uploads/post/' });
const uploadsDir = path.join(__dirname, 'uploads', 'post');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const createPost= async(req,res,next)=>{
    try {
        console.log('Uploaded files:', req.files);

        const { author, caption, tags, location } = req.body;

        if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
        }

        // Process each image: rename to a unique name and save it
        let mediaFiles = await Promise.all(req.files.map(async (file) => {
        if (!file.path) {
            console.error('File path is undefined:', file);
            throw new Error('File path is undefined');
        }

        const uniqueName = `${uuidv4()}-${path.basename(file.originalname)}`;
        const outputPath = path.join(uploadsDir, uniqueName);

        // Ensure the file exists before renaming
        if (!fs.existsSync(file.path)) {
            console.error(`File not found: ${file.path}`);
            throw new Error(`File not found: ${file.path}`);
        }

        // Rename the file
        fs.renameSync(file.path, outputPath);

        return { type: 'image', url: `/uploads/post/${uniqueName}` };
        }));

        const newPost = new Post({
            author,
            media: mediaFiles,
            caption,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            location
        });
        await newPost.save();
        next(CreateSuccess(200,"Post created successfully"))
    } catch (error) {
        console.log(error);
        next(CreateError(500,"Something went wrong"));
    }
}

export const updatePost=async (req, res) => {
  try {
    const postId = req.params.id;
    const { author, caption, tags, location, removeImages = [] } = req.body;

    // Find the existing post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Process new images
    let mediaFiles = await Promise.all(req.files.map(async (file) => {
      const uniqueName = `${uuidv4()}-${path.basename(file.originalname)}`;
      const outputPath = path.join(uploadsDir, uniqueName);

      // Rename the file
      fs.renameSync(file.path, outputPath);

      return { type: 'image', url: `/uploads/post/${uniqueName}` };
    }));

    // Handle removing old images
    if (removeImages.length > 0) {
      removeImages.forEach(imageUrl => {
        const imagePath = path.join(__dirname, '..', 'uploads', 'post', imageUrl.split('/').pop());
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });

      // Filter out removed images from the post's media
      post.media = post.media.filter(media => !removeImages.includes(media.url));
    }

    // Add new images to the post's media
    post.media = [...post.media, ...mediaFiles];

    // Update other post fields
    post.author = author || post.author;
    post.caption = caption || post.caption;
    post.tags = tags ? tags.split(',').map(tag => tag.trim()) : post.tags;
    post.location = location || post.location;

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Check the img type' });
  }
};