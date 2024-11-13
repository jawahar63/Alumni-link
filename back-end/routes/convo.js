import express from 'express'
import { createConvo, getConvo, getOrCreateConvo, search } from '../controllers/convo.controller.js'
import verifyToken from '../middleware/verifyToken.js';

const router =express.Router()

router.post('/createConvo',createConvo);
router.get('/getConvo/:userId',getConvo);
router.post('/getOrCreateConvo',getOrCreateConvo);
router.get('/search',verifyToken,search);

export default router