import fs from "fs";
import path from 'path'
import sharp from "sharp"
import User from "../models/user.js";
import { CreateError } from "../utils/error.js"
import { CreateSuccess } from "../utils/success.js";
import cloudinary from "../utils/cloudinary.js";

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

    // Delete old profile image from Cloudinary if it exists
    if (user.profileImage) {
      const publicId = user.profileImage.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`uploads/dp/${publicId}`, {
        resource_type: 'image',
      });
    }

    // Upload new image to Cloudinary using file buffer
    const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
      folder: 'uploads/dp',
      public_id: req.params.id,
      overwrite: true,
      transformation: [{ width: 300, height: 300, crop: 'fill' }],
    });

    // Update the user's profile image URL
    user.profileImage = result.secure_url;
    await user.save();

    // Respond with the new image URL
    res.status(200).json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return next(CreateError(500, "Failed to upload image to Cloudinary"));
  }
};