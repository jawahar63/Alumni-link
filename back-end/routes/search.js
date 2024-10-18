import express from 'express';
import { autoSuggest } from '../controllers/search.controller.js';
import verifyToken from '../middleware/verifyToken.js';
const router =express.Router();
router.use(verifyToken);

router.get('/autosuggest', autoSuggest);

export default router;