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
        console.log(error);
        return next(CreateError(500,"Internal server error"));
    }
}
export const getAllAlumni=async(req,res,next)=>{
    try {
        const alumniRoleId = '663c71fda7179036de1d8dd5';
        const alumnis=await User.find({ roles: { $in: [alumniRoleId] } }, 'username _id').exec();
        return next(CreateSuccess(200,"all Alumni",alumnis));
    } catch (error) {
        return next(CreateError(500,"Internal server error"));
    }
}