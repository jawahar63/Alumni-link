import express from 'express'
import { createConvo, getConvo } from '../controllers/convo.controller.js'

const router =express.Router()

router.post('/createConvo',createConvo);
router.get('/getConvo/:userId',getConvo);

export default router