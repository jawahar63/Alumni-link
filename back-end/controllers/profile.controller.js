import fs from "fs";
import path from 'path'
import User from "../models/user.js";
import { CreateError } from "../utils/error.js"
import { CreateSuccess } from "../utils/success.js";

const __dirname = path.resolve();
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
export const updateProfileImg = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(CreateError(404, "User not found"));
    }

    // Delete old profile image if it exists
    if (user.profileImage) {
      const oldImagePath = path.join(__dirname, 'uploads', 'dp', path.basename(user.profileImage));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const filePath = `uploads/dp/${req.params.id}${path.extname(req.file.originalname)}`;
    const BASE_URL = process.env.BASE_URL;
    const imageUrl = `${BASE_URL}${filePath}`;

    user.profileImage = imageUrl;
    await user.save();

    res.status(200).json({ imageUrl: imageUrl });
  } catch (error) {
    console.error(error);
    return next(CreateError(500, "Something went wrong"));
  }
};