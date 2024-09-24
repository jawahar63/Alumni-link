import express from 'express'
import { getAllUsers, getById } from '../controllers/user.controller.js';
import { verifyAdmin, verifyUser } from '../utils/verifytoken.js';
import { viewprofile } from '../controllers/profile.controller.js';
import verifyToken from '../middleware/verifyToken.js';

const router =express.Router();
router.use(verifyToken)

router.get("/",verifyAdmin,getAllUsers);
router.get("/:id",verifyUser,getById);
export default router;