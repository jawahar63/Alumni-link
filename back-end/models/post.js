import mongoose from "mongoose";
const { Schema } = mongoose;
const postSchema=new Schema(
    {
        postUser:{
            type:[Schema.Types.ObjectId],
            require:true
        },
        postImages:{
            type: [String],
        }
    }
)