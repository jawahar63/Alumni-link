import express from 'express';
import { login, register, registerAdmin, sendEmail,reset, googleLogin, getData } from '../controllers/auth.controller.js';
import { viewprofile } from '../controllers/profile.controller.js';

const router =express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/google-login",googleLogin);
router.post("/register-admin",registerAdmin);
router.post("/send-email",sendEmail);
router.post("/reset",reset);
router.get("/getdata/:id",getData);
router.use("/",(req,res,next)=>{
    res.send("<h1>hello</h1>");
});
export default router;