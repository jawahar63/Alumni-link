import mongoose from "mongoose";
import Role from "./role.js"; // Adjust the path if necessary

const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        },
        username:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true,
        },
        profileImage:{
            type:String,
            required: false,
            default:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgoKmrlslyJy-XsZsYrBEWNb3Ex-ECISQ8rgMROrX8QjxDsg0OdpWh6qUbHLdZnI_fRAQ&usqp=CAU'// Corrected escape character
        },
        isAdmin:{
            type:Boolean,
            default:false
        },
        roles:{
            type: [Schema.Types.ObjectId],
            required:true,
            ref:"Role"
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
    },
    {
        timestamps:true // Corrected typo: 'timesStamps' -> 'timestamps'
    }
);

const User = mongoose.model("User", UserSchema);

export default User;
