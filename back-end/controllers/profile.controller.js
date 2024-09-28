import fs from "fs";
import path from 'path'
import sharp from "sharp"
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
    if (user.profileImage) {
      const oldImagePath = path.join(__dirname, 'uploads', 'dp', path.basename(user.profileImage));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    const filePath = `uploads/dp/${req.params.id}.jpg`;
    const fullPath = path.join(__dirname, filePath);
    const BASE_URL = process.env.BASE_URL;
    const imageUrl = `${BASE_URL}${filePath}`;

    await sharp(req.file.path)
      .resize({ width: 300, height: 300, fit: sharp.fit.cover }) 
      .jpeg({ quality: 90 })
      .toFile(fullPath);

    user.profileImage = imageUrl;
    await user.save();
    

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error(error);
    return next(CreateError(500, "Something went wrong"));
  }
};