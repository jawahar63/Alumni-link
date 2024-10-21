import jwt from 'jsonwebtoken';
import { CreateError } from './error.js';

export const verifyUser =(req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.id===req.param.id || req.user.isAdmin){
            next();
        }
        return next(CreateError(403,"you are not authorized!"))
    })
}
export const verifyAdmin =(req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next();
        }
        return next(CreateError(403,"you are not authorized!"))
    })
}