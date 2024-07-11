import express, { request } from 'express';
import uploads from '../middleware/upload.js'
import { updateProfile, updateProfileImg, viewprofile } from '../controllers/profile.controller.js';
import multer from 'multer';


// const MIME_TYPE_MAP ={
//     'image/png':'png',
//     'image/jpeg':'jpg',
//     'image/jpg':'jpg'
// }

// const storage =multer.diskStorage({
//     destination:(req,file,cb)=>{
//         const isValid=MIME_TYPE_MAP[file.mimetype];
//         let error=new Error("Invalid file type");
//         if(isValid){
//             error=null;
//         }
//         cb(error,"backend/uploads/dp");
//     },
//     filename:(req,file,cb)=>{
//         const name =file.originalname.toLocaleLowerCase().split(' ').join('-');
//         const ext=MIME_TYPE_MAP[file.mimetype];
//         cb(null,name+'-'+Date.now()+'.'+ext);
//     }
// })

const router =express.Router();
router.get("/:id",viewprofile);
router.put("/edit/:id",updateProfile);
router.post('/edit/:id/upload-image', uploads.single('profileImage'),updateProfileImg);
router.use("/",(req,res,next)=>{
    res.send("<h1>hello</h1>");
});
export default router;