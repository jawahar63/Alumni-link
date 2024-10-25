import express from 'express'
import { createConvo, getConvo, search } from '../controllers/convo.controller.js'
import verifyToken from '../middleware/verifyToken.js';

const router =express.Router()

router.post('/createConvo',createConvo);
router.get('/getConvo/:userId',getConvo);
router.get('/search',verifyToken,search);

export default router