import express from 'express'
import { deleteMessage, getMessage, lastMessage, ReadMessage, ReceiveMessage, sendMessage, unreadMessagesCount } from '../controllers/message.controller.js';
import verifyToken from '../middleware/verifyToken.js';

const router =express.Router()

router.post('/send',sendMessage);
router.get('/getMessage/:conversationId/:userId',getMessage);
router.patch('/read/:messageId',ReadMessage);
router.patch('/receive/:messageId',ReceiveMessage);
router.delete('/delete/:messageId',deleteMessage);
router.get('/unread/:userId',unreadMessagesCount);
router.get('/last/:userId',lastMessage);


export default router