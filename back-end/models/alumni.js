import mongoose from "mongoose";
import User from "./user";

const { Schema } = mongoose;

const alumniDetails=new Schema(
    {
        alumni:{
            type: [Schema.Types.ObjectId],
            required:true,
            ref:"User"
        },
        domain:{
            type:String,
            required:false
        },
        batch:{
            type:String,
            required:false
        },
        company:{
            type:String,
            required:false
        },
        Phone_no:{
            type:Number,
            required:false
        },
        age:{
            type:Number,
            require:false
        },
        experiences:{
            type:Number,
            require:false
        },
        location:{
            type:String,
            required:false
        },
        linkedin:{
            type:String,
            required:false
        },
        github:{
            type:String,
            required:false
        },
        skill:{
            type:[String],
            require:false
        }
        
    }
);
const AlumniDetails=mongoose.model("Alumni",alumniDetails);
export default AlumniDetails;