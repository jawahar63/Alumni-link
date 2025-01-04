import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import roleRoute from './routes/role.js';
import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';
import postRoute from './routes/post.js';
import eventRoute from './routes/event.js';
import searchRoute from './routes/search.js';
import profileRoute from './routes/profile.js';
import convoRoute from './routes/convo.js';
import messageRoute from './routes/message.js';
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from "path";
import http from 'http';
import {Server} from 'socket.io';
import event from './models/event.js';
import { connectDB } from './utils/db.js';


const app=express();
const server =http.createServer(app);
const io = new Server(server,{
    pingTimeout:60000,
    cors:{
        origin:process.env.LIVE_URL,
        credentials: true 
    }

});
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    // origin:'**',
    origin: process.env.LIVE_URL,
    credentials: true
}));
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
app.use('/api/event',eventRoute);
app.use('/api/search',searchRoute);
app.use('/api/convo',convoRoute);
app.use('/api/message',messageRoute);
app.get('/', (req, res) => {
    res.json({ message: 'hi' });
    res.redirect('https://alumni-link-bit.vercel.app/')
});
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

io.on('connection',(socket)=>{
    console.log('user Connected',socket.id);
    socket.on('message',(msg)=>{
        io.emit('message',msg);
    })
    socket.on('joinChat', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    socket.on('sendMessage', (messageData) => {
        const { room, message } = messageData;
    });
    socket.on('changeIsRead',(messageData)=>{
        const { room, message } = messageData;
        message.isRead=true
        io.to(room).emit('isRead', message);
    })
    socket.on('disconnect', () => {
    console.log('user disconnected');
  });
})



// app.listen(4000,'0.0.0.0',()=>{
//     mongoDb();
//     console.log("Connected");
// })
export { io, server };

server.listen(4000,'0.0.0.0',()=>{
    // mongoDb();
    connectDB();
    console.log("Connected");
})