import jwt from 'jsonwebtoken';
import { CreateError } from '../utils/error.js';
import { PDFArrayIsNotRectangleError } from 'pdf-lib';

export const verifyToken = (req, res, next) => {

    const token = req.cookies.access_token || req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return next(CreateError(401, "You are not authenticated"));
    }  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return next(CreateError(403, "Token has expired"));
            }
            return next(CreateError(403, "Token is not valid"));
        }
        
        req.user = user;
        next();
    });
};
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
export const verifyMentor =(req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.roles[0].role==='mentor'){
            next();
        }else{
        return next(CreateError(403,"you are not authorized!"))
        }
    })
}
export const verifyAlumni =(req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.roles[0].role=='alumni'){
            next();
        }
        return next(CreateError(403,"you are not authorized!"))
    })
}
export default verifyToken;
