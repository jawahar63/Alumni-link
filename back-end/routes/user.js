import express from 'express'
import { getAllAlumni, getAllUsers, getById } from '../controllers/user.controller.js';
import { verifyAdmin, verifyUser } from '../utils/verifytoken.js';
import { viewprofile } from '../controllers/profile.controller.js';
import verifyToken, { verifyMentor } from '../middleware/verifyToken.js';

const router =express.Router();
// router.use(verifyToken)

router.get("/",verifyAdmin,getAllUsers);
router.get('/alumni',verifyMentor,getAllAlumni);
router.get("/:id",verifyUser,getById);

export default router;