import mongoose from 'mongoose';
import { CreateError } from '../utils/error.js';
import User from '../models/user.js';
import { CreateSuccess } from '../utils/success.js';
import convo from '../models/convo.js';
import message from '../models/message.js';
import {io} from "../index.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, sender, content } = req.body;

    const conversation = await convo.findById(conversationId);
    if (!conversation) {
      return next(CreateError(404, 'Conversation not found'));
    }

    if (!conversation.participants.includes(sender)) {
      return next(CreateError(403, 'You are not a participant of this conversation'));
    }

    const newMessage = new message({
      conversationId,
      sender,
      content,
    });
    await newMessage.save();
    await newMessage.populate('sender', 'username email profileImage');

    conversation.lastMessage = content;
    conversation.lastMessageAt = Date.now();
    await conversation.save();
    await conversation.populate({
      path: 'participants',
      select: 'firstName lastName username email profileImage roles batch domain company',
      populate: {
        path: 'roles',
        select: 'role'
      }
    });

    const filteredParticipants = conversation.participants.filter(
      (participant) => participant._id.toString() !== sender
    );

    const formattedParticipants = filteredParticipants.map((participant) => {
      const isAlumni = participant.roles.some((role) => role.role === 'alumni');
      return isAlumni
        ? {
            _id: participant._id,
            username: participant.username,
            email: participant.email,
            profileImage: participant.profileImage,
            batch: participant.batch || null,
            domain: participant.domain || null,
            company: participant.company || null,
          }
        : {
            _id: participant._id,
            username: participant.username,
            email: participant.email,
            profileImage: participant.profileImage,
          };
    });

    const unreadMessageCount = await message.countDocuments({
      conversationId: conversation._id,
      sender: { $ne: sender },
      isRead: false,
    });
    await message.updateMany(
      { conversationId: conversation._id, sender: { $ne: sender } },
      { $set: { isReceive: true } }
    );

    const formattedConversation = {
      _id: conversation._id,
      participant: formattedParticipants[0],
      lastMessage: conversation.lastMessage,
      lastMessageAt: conversation.lastMessageAt,
      createdAt: conversation.createdAt,
      unreadMessageCount,
    };

    io.to(conversationId).emit('receiveMessage', newMessage);
    io.to(conversationId).emit('ConvoDataChange', formattedConversation);

    return next(CreateSuccess(201, "Message Created Successfully", newMessage));
  } catch (error) {
    return next(CreateError(500, error.message || "Internal Server Error"));
  }
};
export const getMessage=async(req,res,next)=>{
    try {
        const { conversationId,userId } = req.params;
        const messages = await message.find({ conversationId }).populate('sender', 'username email profileImage');
        

        if (!messages) {
            return next(CreateError(404,'No messages found for this conversation'));
        }
        await message.updateMany(
            { conversationId, sender: { $ne: userId } },
            { $set: { isRead: true } }
        );
        const updatedMessages = await message.find({ conversationId }).populate('sender', 'username email profileImage');
        io.to(conversationId).emit('updatedMessages', updatedMessages);
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

