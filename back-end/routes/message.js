import express from 'express'
import { deleteMessage, getMessage, lastMessage, ReadMessage, search, sendMessage, unreadMessagesCount } from '../controllers/message.controller.js';
import verifyToken from '../middleware/verifyToken.js';

const router =express.Router()

router.post('/send',sendMessage);
router.get('/getMessage/:conversationId',getMessage);
router.patch('/:messageId/read',ReadMessage);
router.delete('/delete/:messageId',deleteMessage);
router.get('/unread/:userId',unreadMessagesCount);
router.get('/last/:userId',lastMessage);
router.get('/search',verifyToken,search);

export default router