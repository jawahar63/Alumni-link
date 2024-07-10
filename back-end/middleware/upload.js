import path from 'path';
import multer from 'multer';
import { CreateError } from '../utils/error.js';

var storage= multer.diskStorage({
    destination:function(req,file,next){
        next(null,'uploads/')
    },
    filename:function(res,file,next){
        let ext=path.extname(file.originalname)
        next(null,Date.now()+ext)
    }
})
var uploads = multer({
    storage:storage,
    fileFilter:function(req,file,next){
        if(
            file.mimetype == "image/png"||
            file.mimetype == "image/jpg"
        ){
            next(null,true);
        }else{
            next(CreateError(400,"Only jpg or png supported"));
        }
    },
    limits:{
        fieldSize:1024*1024*2
    }
})
export default uploads