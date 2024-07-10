
import User from "../models/user.js";
import { CreateError } from "../utils/error.js"
import { CreateSuccess } from "../utils/success.js";
export const viewprofile =async (req,res,next)=>{
    try {
        const user= await User.findById(req.params.id);
        if(!user)
            return next(CreateError(404,"user not found"));
        return next(CreateSuccess(200,user));
    } catch (error) {
        console.log(error);
        return next(CreateError(500, "Something went wrong"));
    }
}
export const updateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(CreateError(404, "User not found"));
        }

        const updateData = { ...req.body };
        if (req.file) {
            const BASE_URL = process.env.BASE_URL
            updateData.profileImage = `${BASE_URL}${req.file.path}`;
        }

        const newData = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        );

        if (!newData) {
            return next(CreateError(404, "User not found"));
        }

        res.status(200).json({ message: "Updated successfully", user: newData });
    } catch (error) {
        console.error(error);
        return next(CreateError(500, "Something went wrong"));
    }
};