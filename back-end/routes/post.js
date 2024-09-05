import express from "express";
import upload from "../middleware/post_upload.js"
import { createPost, updatePost } from "../controllers/post.controller.js";

const router =express.Router();

router.post('/create-post',upload.array('media'),createPost);
router.put('/edit/:id',upload.array('media'),updatePost);
export default router;
