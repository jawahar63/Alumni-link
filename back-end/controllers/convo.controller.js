import mongoose from 'mongoose';
import { CreateError } from '../utils/error.js';
import User from '../models/user.js';
import { CreateSuccess } from '../utils/success.js';
import convo from '../models/convo.js';
import message from '../models/message.js';

export const createConvo =async (req,res,next)=>{
    try {
        const {participants}=req.body;
        if(participants.length!==2){
            return next(CreateError(400,'Exactly 2 participants are required'));
        }

        const users =await User.find({_id:{$in:participants}}).populate('roles');

        if(users.length!==2)
            return next(CreateError(400,'One or both users not found'));

        const [user1,user2]=users

        const user1Roles=user1.roles.map(role=>role.role);
        const user2Roles=user2.roles.map(role=>role.role);
        // console.log(user1Roles)
        // console.log(user2Roles)

        if (!(
        (user1Roles.includes('alumni') && (user2Roles.includes('User') || user2Roles.includes('Mentor'))) ||
        (user2Roles.includes('alumni') && (user1Roles.includes('User') || user1Roles.includes('Mentor')))
        )) {
            return next(CreateError(400,'Invalid role combination. Only Alumni-User or Alumni-Mentor conversations allowed'));
        }

        const conversation = new convo({ participants });
        const savedConversation = await conversation.save();

        return next(CreateSuccess(200, "Convo Created Successfully",savedConversation));
    } catch (error) {
        return next(CreateError(500, error.message || "Internal Server Error"));
    }
}
export const getConvo = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const convos = await convo.find({
      participants: { $in: [userId] }
    }).populate({
      path: 'participants',
      select: 'firstName lastName username email profileImage roles batch domain company',
      populate: {
        path: 'roles',
        select: 'role'
      }
    });

    // Iterate through each conversation
    const formattedConvo = await Promise.all(convos.map(async (convo) => {
      // Filter out the current user's details from participants
      const filteredParticipants = convo.participants.filter(participant => participant._id.toString() !== userId);

      // Format each participant's details based on their role
      const formattedParticipants = filteredParticipants.map(participant => {
        const isAlumni = participant.roles.some(role => role.role === 'alumni');
        return isAlumni
          ? {
              _id: participant._id,
              username: participant.username,
              email: participant.email,
              profileImage: participant.profileImage,
              batch: participant.batch || null,
              domain: participant.domain || null,
              company: participant.company || null
            }
          : {
              _id: participant._id,
              username: participant.username,
              email: participant.email,
              profileImage: participant.profileImage
            };
      });

      const unreadMessageCount = await message.countDocuments({
        conversationId: convo._id,
        sender: { $ne: userId },
        isRead: false
      });

      return {
        _id: convo._id,
        participants: formattedParticipants,
        lastMessage: convo.lastMessage,
        lastMessageAt: convo.lastMessageAt,
        createdAt: convo.createdAt,
        unreadMessageCount // Add unread message count here
      };
    }));

    return next(CreateSuccess(200, "convo", formattedConvo));
  } catch (error) {
    return next(CreateError(500, error.message || "Internal Server Error"));
  }
};
export const search = async (req, res, next) => {
    try {
        const { query } = req.query; 
        const user = req.user;
        
        let searchResults;
        let filteredResults;
        
        if (user.roles.some(role => role.role === 'alumni')) {
            searchResults = await User.find({
                $or: [
                    { firstName: { $regex: query, $options: 'i' } },
                    { lastName: { $regex: query, $options: 'i' } },
                    { username: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } }
                ]
            })
            .populate({
                path: 'roles',
                select: 'role'
            })
            .select('username profileImage');

            filteredResults = searchResults.filter(user =>
                user.roles.some(role => role.role === 'User' || role.role === 'mentor')
            );
        } else if (user.roles.some(role => role.role === 'User') || user.roles.some(role => role.role === 'mentor')) {
            searchResults = await User.find({
                $or: [
                    { firstName: { $regex: query, $options: 'i' } },
                    { lastName: { $regex: query, $options: 'i' } },
                    { username: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } }
                ]
            })
            .populate({
                path: 'roles',
                match: { role: 'alumni' },
                select: 'role'
            })
            .select('username profileImage');

            filteredResults = searchResults.filter(user =>
                user.roles.some(role => role.role === 'alumni')
            );
        } else {
            return res.status(403).json({ message: "You are not authorized to perform this search" });
        }

        // Send a single response after the conditions
        res.status(200).json(filteredResults);
        
    } catch (error) {
        return next(CreateError(500, error.message || "Internal Server Error"));
    }
}

