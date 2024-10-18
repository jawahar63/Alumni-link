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
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from "path";
import http from 'http';
import {Server} from 'socket.io';
import event from './models/event.js';


const app=express();
const server =http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:[
            'http://localhost:4200',
        ],
        credentials: true 
    }

});
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    // origin:'**',
    origin: [
        'http://localhost:4200',
        'http://192.168.137.1:4200',
    ],
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
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
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
    mongoDb();
    console.log("Connected");
})