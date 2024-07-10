import User from "../models/user.js";
import { CreateError } from "../utils/error.js"
import { CreateSuccess } from "../utils/success.js";

export const getAllUsers= async(req,res,next)=>{
    try {
        const users= await User.find();
        return next(CreateSuccess(200,"all User",users));
    } catch (error) {
        return next(CreateError(500,"Internal server error"));
    }
}
export const getById= async(req,res,next)=>{
    try {
        const users= await User.findById(req.params.id);
        if(!user)
            return next(CreateError(404,"user not found"));
        return next(CreateSuccess(200,"User is",user));
    } catch (error) {
        return next(CreateError(500,"Internal server error"));
    }
}