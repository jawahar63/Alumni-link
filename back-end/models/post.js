import mongoose from "mongoose";
import User from "./user";
const { Schema } = mongoose;
const postSchema=new Schema(
    {
        postUser:{
            type:[Schema.Types.ObjectId],
            require:true,
            ref:'user'
        },
        postImages:{
            type: [String],
        },
        discription:{
            type: String
        }
    }
)