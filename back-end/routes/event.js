import express from 'express'
import verifyToken, { verifyMentor } from '../middleware/verifyToken.js';
import { createEvent, getAllEvent } from '../controllers/event.controller.js';

const router =express.Router();
router.use(verifyToken);
router.post('/createEvent',createEvent);
router.get('/getAllEvent',getAllEvent);

export default router