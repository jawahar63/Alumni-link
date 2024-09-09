import mongoose from "mongoose";
import User from "./user.js";
const { Schema } = mongoose;
const CommentSchema =new Schema({
    Commenter:{
        type:Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    CommentText:{
        type:String,
        require:true,
        maxlenght:500
    },
    CommentAt:{
        type:Date,
        default:Date.now
    }
});
const LikeSchema =new Schema({
    liker:{
        type:Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    likedAt:{
        type:Date,
        default:Date.now
    }
})
const MediaSchema = new Schema({
  type: {
    type: String,
    enum: ['image'],
  },
  url: {
    type: String,
  }
});
const PostSchema = new Schema({
    author:{
        type:Schema.Types.ObjectId,
        ref:'User',
        require:true,
        index:true
    },
    media:[MediaSchema],
    caption:{
        type: String,
        maxlength: 1000,
        require:true
    },
    tags: [{
        type: String,
        lowercase: true,
        trim: true
    }],
    location: {
        type: String,
        trim: true
    },
    likes: [LikeSchema],
    comments: [CommentSchema],
    createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date
  }
})
const Post = mongoose.model('Post', PostSchema);
export default Post;