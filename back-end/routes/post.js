import express from "express";
import upload from "../middleware/post_upload.js"
import { Addcomment, Addlike, createPost, filterPosts, getAllPosts, getComments, getLikes, getPostById, getPostsByAuthor, updatePost } from "../controllers/post.controller.js";

const router =express.Router();

router.post('/create-post',upload.array('media'),createPost);
router.put('/edit/:postId',upload.array('media'),updatePost);
router.get('/posts/:postId',getPostById);
router.get('/posts', getAllPosts);
router.get('/posts/author/:authorId', getPostsByAuthor);
router.get('/posts/filter', filterPosts);
router.post('/:postId/newcomment',Addcomment);
router.post('/:postId/newlike',Addlike);
router.get('/:postId/comments', getComments);
router.get('/:postId/likes', getLikes);
export default router;
