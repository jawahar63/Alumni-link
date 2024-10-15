import Role from "../models/role.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";
import usertoken from "../models/usertoken.js";
import nodemailer from "nodemailer";
import { json } from "express";

export const register = async (req,res,next)=>{
    try {
        const receicedRole=req.body.role;
        const role = await Role.find({role:receicedRole});
        console.log(receicedRole);
        const salt = await bcrypt.genSalt(8);
        const hasPassword = await bcrypt.hash(req.body.password,salt);
        const newUser = new User({
            firstName:req.body.firstname,
            lastName:req.body.lastname,
            username:req.body.username,
            email:req.body.email,
            password:hasPassword,
            roles:role
        });
        await newUser.save();
        return next(CreateSuccess(200,"User created"));
    } catch (error) {
        return next(CreateError(500,"Something went wrong"));
    }
};
export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email }).populate("roles", "role");
        
        if (!user) {
            return next(CreateError(404, "User not found"));
        }
        
        // Check password
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) {
            return next(CreateError(400, "Incorrect password"));
        }
        let token='';
        // Generate JWT token
        if(user.roles[0].role!=='alumni'){
            token = jwt.sign(
                { id: user._id, isAdmin: user.isAdmin, roles: user.roles,username:user.username,profileImage:user.profileImage},
                process.env.JWT_SECRET,{expiresIn:'1d'}
            );
        }else{
            // console.log(user.batch+" "+user.domain+" "+user.company);
            token = jwt.sign(
                { id: user._id, isAdmin: user.isAdmin, roles: user.roles,username:user.username,profileImage:user.profileImage,batch:user.batch,domain:user.domain,company:user.company},
                process.env.JWT_SECRET,{expiresIn:'1d'}
            );
        }

        // Send token in cookie and response
        res.cookie("access_token", token, { httpOnly: true }).status(200).json({
            status: 200,
            message: "Login success",
            access_token: token,
            // data: user
        });
    } catch (error) {
        console.log(error);
        return next(CreateError(500, "Something went wrong"));
    }
};

export const registerAdmin = async (req,res,next)=>{

   
    try {
        const role = await Role.find({});
        const salt = await bcrypt.genSalt(8);
        const hasPassword = await bcrypt.hash(req.body.password,salt);
        const newUser = new User({
            firstName:req.body.firstname,
            lastName:req.body.lastname,
            username:req.body.username,
            email:req.body.email,
            password:hasPassword,
            isAdmin:false,
            roles:role
        });
        await newUser.save();
        return next(CreateSuccess(200,"Admin created"));
    } catch (error) {
        return next(CreateError(500,"Something went wrong"));
    }
};
export const sendEmail= async(req,res,next)=>{
    const email =req.body.email;
    const user=await User.findOne({email:{$regex:'^'+email+"$",$options:'i'}});
    if(!user){
        return next(CreateError(404,"User is not found"));
    }
    const payload={
        email:user.email
    }
    const expiryTime=300;
    const token =jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:expiryTime});
    const newToken=new usertoken({
        userId:user._id,
        token:token
    });
    const mailtransporter=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"d.jawahar6382@gmail.com",
            pass:"auvgeuuoolvjstjr"
        }
    });
    let mailDetails={
        form:"d.jawahar6382@gmail.com",
        to:email,
        subject:"Reset Password link",
        html:`
        <html>
        <head>
        <title>Password reset Request<title>
        </head>
        <body>
        <h1>Password reset Request</h1>
        <p>Dear ${user.username} </p>
        <p>We have receiced a request to reset your password for your account. To complete the password reset process, please click on the button</p>
        <a>href=${process.env.LIVE_URL}/reset/${token}<button style="background-color: #EDAE2F;color:white; padding:14px 20px;border:none;cursor:pointer;border-radius:4px" >Reset Password</button></a>
        <p>PLease note that this link is only valid for 5 mins. If you didn't request a password reset, please ignored it</p>
        <p>Thank you</p>
        <p>Alumni Connect</p>
        <body>
        </html>`,
    };
    mailtransporter.sendMail(mailDetails, async(err,data)=>{
        if(err){
            console.log(err);
            return next(CreateError(500,"Something went wrong"));
        }else{
            await newToken.save();
            return next(CreateSuccess(200,"mail sent successfully"));
        }
    })
};
export const reset=(req,res,next)=>{
    const token =res.body.token;
    const newPassword =res.body.password;

    jwt.verify(token,process.env.JWT_SECRET,async(err,data)=>{
        if(err){
            return CreateError(500,"Reset link is Expired!")
        }else{
            const response =data;
            const user=await User.findOne({email:{$regex:'^'+response.email+"$",$options:'i'}});
            const salt =await bcrypt.genSalt(8);
            const enPassword=await bcrypt.hash(newPassword,salt);
            user.password=enPassword;
            try {
                const updated=await User.findOneAndUpdate(
                    {_id:user._id},
                    {$set: user},
                    {new:true}
                )
                return next(CreateSuccess(200,"Password reseted successfully"))
            } catch (error) {
                return next(CreateError(500,"Something went wrong"));
            }
        }
    });
}
export const googleLogin = async(req,res,next)=>{
    try {
        const user =await User.findOne({email:req.body.email})
        .populate("roles","role");
        if(!user){
            return next(CreateError(404,"user not found"));
        }
        const {roles}=user;
        const token =jwt.sign(
            {id:user._id,isAdmin:user.isAdmin,roles:roles},
            process.env.JWT_SECRET,{expiresIn:'1d'}
        )
        res.cookie("access_token",token,{httpOnly:true}).status(200)
        .json({
            status:200,
            message:"login Succes",
            access_token:token,
            data:user
        })
        // return next(CreateSuccess(200,"login Seccess!"));
    } catch (error) {
        return next(CreateError(500,"Something went wrong"));
    }
}
export const getData =async(req,res,next)=>{
   const user = await User.findById(req.params.id);
    if (!user) {
      return next(CreateError(404, "User not found"));
    }
    const data={
        username:user.username,
        profileImage:user.profileImage
    }
    return next(CreateSuccess(200,data));
}