import express from "express";
import upload from "../middleware/post_upload.js"
import { AddComment, AddLike, createPost, deleteComment, deletePost, editComment, filterPosts, getAllPosts, getComments, getLikes, getPostById, getPostsByAuthor, updatePost } from "../controllers/post.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router =express.Router();
router.use(verifyToken)

router.post('/create-post',upload.array('media'),createPost);
router.put('/edit/:postId',upload.array('media'),updatePost);
router.get('/posts/:postId',getPostById);
router.get('/posts', getAllPosts);
router.get('/posts/author/:authorId', getPostsByAuthor);
router.get('/posts/filter', filterPosts);

router.delete('/:postId/delete',deletePost);
router.post('/:postId/newcomment',AddComment);
router.put('/:postId/editcomment/:commentId',editComment);
router.put('/:postId/deletecomment/:commentId',deleteComment);
router.post('/:postId/newlike',AddLike);
router.get('/:postId/comments', getComments);
router.get('/:postId/likes', getLikes);
export default router;
