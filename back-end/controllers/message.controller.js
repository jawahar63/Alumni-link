import mongoose from 'mongoose';
import { CreateError } from '../utils/error.js';
import User from '../models/user.js';
import { CreateSuccess } from '../utils/success.js';
import convo from '../models/convo.js';
import message from '../models/message.js';

export const sendMessage=async(req,res,next)=>{
    try {
        const { conversationId, sender, content } = req.body;

        const conversation = await convo.findById(conversationId);
        if (!conversation) {
            return next(CreateError(404,'Conversation not found'));
        }

        if (!conversation.participants.includes(sender)) {
            return next(CreateError(403,'You are not a participant of this conversation'));
        }
        const Message = new message({
            conversationId,
            sender,
            content,
        });
        await Message.save();
        conversation.lastMessage = content;
        conversation.lastMessageAt = Date.now();
        await conversation.save();

        return next(CreateSuccess(201, "Message Created Successfully",Message));
    } catch (error) {
        return next(CreateError(500, error.message || "Internal Server Error"));
    }
}
export const getMessage=async(req,res,next)=>{
    try {
        const { conversationId } = req.params;
        const messages = await message.find({ conversationId }).populate('sender', 'username email profileImage');

        if (!messages) {
            return next(CreateError(404,'No messages found for this conversation'));
        }
        return next(CreateSuccess(200, "Message getted Successfully",messages));
    } catch (error) {
        return next(CreateError(500, error.message || "Internal Server Error"));
    }
}
export const ReadMessage=async(req,res,next)=>{
    try {
        const { messageId } = req.params;

        const Message = await message.findByIdAndUpdate(messageId, { isRead: true }, { new: true });

        if (!Message) {
            return next(CreateError(404,'Message not found'));
        }

        return next(CreateSuccess(200, 'Message marked as read',Message));
    } catch (error) {
        return next(CreateError(500, error.message || "Internal Server Error"));
    }
}

export const deleteMessage=async(req,res,next)=>{
    try {
        
        const { messageId } = req.params;

        const Message = await message.findByIdAndDelete(messageId);

        if (!Message) {
            return next(CreateError(404,'Message not found'));
        }
        return next(CreateSuccess(200, 'Message deleted successfully'));
    } catch (error) {
        return next(CreateError(500, error.message || "Internal Server Error"));
    }
}

export const unreadMessagesCount =async(req,res,next)=>{
    try {
        const { userId } = req.params;

        const unreadMessages = await message.find({
            sender: { $ne: userId },
            isRead: false,
            conversationId: { $in: await convo.find({ participants: userId }).distinct('_id') }
        });

        return next(CreateSuccess(200, 'unreadCount',unreadMessages.length));
    } catch (error) {
        return next(CreateError(500, error.message || "Internal Server Error"));
    }
}

export const lastMessage =async(req,res,next)=>{
    try {
        const { userId } = req.params;

        const conversations = await convo.find({ participants: userId }).populate('lastMessage');

        const lastMessages = await Promise.all(conversations.map(async (conversation) => {
        const lastMessage = await message.findOne({ conversationId: conversation._id })
            .sort({ sentAt: -1 })
            .populate('sender', 'username email profileImage');
        return lastMessage;
        }));
        return next(CreateSuccess(200, 'lastMessages',lastMessages));
    } catch (error) {
        return next(CreateError(500, error.message || "Internal Server Error"));
    }
}

