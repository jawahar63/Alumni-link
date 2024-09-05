import express from "express";
import upload from "../middleware/post_upload.js"
import { createPost } from "../controllers/post.controller.js";
const router =express.Router();
router.post('/create-post',upload.array('media'),createPost)
export default router;
