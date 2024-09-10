import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import roleRoute from './routes/role.js';
import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';
import postRoute from './routes/post.js'
import profileRoute from './routes/profile.js';
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from "path";

const app=express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:4200'],
    Credentials:true
}
));
const mongoDb= async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Connected to DB")
    } catch (error) {
        throw error;
    }
}
app.use("/api/role",roleRoute);
app.use("/api/auth",authRoute);
app.use("/api/user",userRoute);
app.use("/api/profile",profileRoute);
app.use('/uploads', express.static('uploads'));
app.use('/api/post',postRoute);
app.use((obj,req,res,next)=>{
    const statusCode =obj.status||500;
    const Message =obj.message||"something went wrong"
    res.status(statusCode).json({
        success:[200,201,204].some(a=>a===obj.status)? true:false,
        status:statusCode,
        message:Message,
        data:obj.data,
    })
});

app.listen(4000,()=>{
    mongoDb();
    console.log("Connected");
})