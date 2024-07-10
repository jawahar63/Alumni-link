import mongoose from "mongoose";
import { Schema } from "mongoose";

const RoleSchema = mongoose.Schema(
    {
        role:{
            type:String,
            required:true
        }
    },
    {
        timeStamps:true
    }
);

export default mongoose.model("Role",RoleSchema);