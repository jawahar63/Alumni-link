import jwt from 'jsonwebtoken';
import { CreateError } from '../utils/error.js';
import { PDFArrayIsNotRectangleError } from 'pdf-lib';

const verifyAsync = promisify(jwt.verify);

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.access_token || req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "You are not authenticated" });
        }

        const user = await verifyAsync(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(403).json({ message: "Token has expired" });
        }
        return res.status(403).json({ message: "Token is not valid" });
    }
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
        if(req.user.roles[0].role==='alumni'){
            next();
        }else{
            return next(CreateError(403,"you are not authorized "))
        }
    })
}
export default verifyToken;
