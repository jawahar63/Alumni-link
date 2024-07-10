import express, { request } from 'express';
import uploads from '../middleware/upload.js'
import { updateProfile, viewprofile } from '../controllers/profile.controller.js';

const router =express.Router();
router.get("/:id",viewprofile);
router.put("/edit/:id",uploads.single('profileImage'),updateProfile);
router.use("/",(req,res,next)=>{
    res.send("<h1>hello</h1>");
});
export default router;