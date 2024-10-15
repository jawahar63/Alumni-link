import mongoose from 'mongoose';
import verifyToken from "../middleware/verifyToken.js";
import Event from "../models/event.js";
import User from "../models/user.js";
import { CreateError } from "../utils/error.js"
import { CreateSuccess } from "../utils/success.js";
import {io} from "../index.js";



export const createEvent = async (req, res, next) => {
    try {
        await new Promise((resolve, reject) => {
            verifyToken(req, res, (err) => {
                if (err) {
                    return reject(err);
                }
                if (req.user.roles[0].role !== 'mentor') {
                    return reject(CreateError(403, "You are not authorized!"));
                }
                resolve();
            });
        });
        const newEvent = new Event({
            createdBy: req.body.createdBy,
            eventName: req.body.eventName,
            alumniId: req.body.alumniId,
            typeofEvent: req.body.typeofEvent,
            fromDate: req.body.fromDate,
            toDate: req.body.toDate,
            mode: req.body.mode,
            venue: req.body.mode === 'offline' ? req.body.venue : undefined
        });

        await newEvent.save();
        io.emit('newEvent', newEvent);
        
        return next(CreateSuccess(200, "Event Created Successfully", newEvent));
    } catch (error) {
        return next(CreateError(500, error.message || "Internal Server Error"));
    }
};
export const updateEvent= async (req,res,next)=>{
    try {
        await new Promise((resolve, reject) => {
            verifyToken(req, res, (err) => {
                if (err) {
                    return reject(err);
                }
                if (req.user.roles[0].role !== 'mentor') {
                    return reject(CreateError(403, "You are not authorized!"));
                }
                resolve();
            });
        });
        const {id,mentorId}=req.params;
        const user =await User.findById(mentorId);
        if(!user)
            return next(CreateError(404, "User not found"));

        const Event=await Event.findById(id)

        if(!Event)
            return next(CreateError(404, "event not found"));

        if(!Event.createdBy.equals(new mongoose.Types.ObjectId(mentorId)))
            return next(CreateError(403, "Unauthorized to update this Event"));

        const updatedEvent = await Event.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        return next(CreateSuccess(200, "Event updated successfully", updatedEvent));

    } catch (error) {
        return next(CreateError(500, error.message || "Internal Server Error"));
    }
}
export const getAllEvent =async (req,res,next)=>{
    try {
        const events = await Event.find()
            .populate({
                path: 'createdBy',
                select: 'username'
            })
            .populate({
                path: 'alumniId',
                select: 'username _id'
            }).sort({ createdAt: -1 });
        return next(CreateSuccess(200, "All events", events));
    } catch (error) {
        return next(CreateError(500, error.message || "Internal Server Error"));
    }
}
export const getAllEventCreatedByMentor =async (req,res,next)=>{
    try {
        const {id}=req.params;
        const events = await Event.find({createdBy:id})
        .populate({
                path: 'createdBy',
                select: 'username'
            })
            .populate({
                path: 'alumniId',
                select: 'username _id'
            }).sort({ createdAt: -1 });

        return next(CreateSuccess(200, "All events", events));
    } catch (error) {
        return next(CreateError(500, error.message || "Internal Server Error"));
    }
}
export const getAllEventByAlumni =async (req,res,next)=>{
    try {
        const {id}=req.params;
        const events =await Event.find({alumniId:id})
        .populate({
                path: 'createdBy',
                select: 'username'
            })
            .populate({
                path: 'alumniId',
                select: 'username _id'
            }).sort({ createdAt: -1 });

        return next(CreateSuccess(200, "All events", events));
    } catch (error) {
        return next(CreateError(500, error.message || "Internal Server Error"));
    }
}
export const getAllApprovedEvent =async (req,res,next)=>{
    try {
        const events = (await Event.find({status:'approved'}))
        .populate({
                path: 'createdBy',
                select: 'username'
            })
            .populate({
                path: 'alumniId',
                select: 'username _id'
            }).sort({ createdAt: -1 });

        return next(CreateSuccess(200, "All events", events));
    } catch (error) {
        return next(CreateError(500, error.message || "Internal Server Error"));
    }
}
export const getAllEventRegisterByStudent =async (req,res,next)=>{
    try {
        const {id} =req.params;
        const events = await Event.find({registerStudents:id})
        .populate({
                path: 'createdBy',
                select: 'username'
            })
            .populate({
                path: 'alumniId',
                select: 'username _id'
            }).sort({ createdAt: -1 });

        return next(CreateSuccess(200, "All events", events));
    } catch (error) {
        return next(CreateError(500, error.message || "Internal Server Error"));
    }
}
export const ChangeEventStatus =async (req,res,next)=>{
    try {
        await new Promise((resolve, reject) => {
            verifyToken(req, res, (err) => {
                if (err) {
                    return reject(err);
                }
                if (req.user.roles[0].role !== 'alumni') {
                    return reject(CreateError(403, "You are not authorized!"));
                }
                resolve();
            });
        });
        const {eventId,alumniId}= req.params;
        const {status,description} =req.body;
        console.log(eventId,alumniId,status,description)

        const user =await User.findById(alumniId);
        if(!user)
            return next(CreateError(404, "User not found"));

        const event=await Event.findById(eventId)

        if(!event)
            return next(CreateError(404, "event not found"));

        if(!event.alumniId.equals(new mongoose.Types.ObjectId(alumniId)))
            return next(CreateError(403, "Unauthorized to update this Event"));
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            { status, description },
            { new: true, runValidators: true })
        return next(CreateSuccess(200, "Status Changed", updatedEvent));
    } catch (error) {
        return next(CreateError(500, error.message || "Internal Server Error"));
    }
}
export const registerStudents=async(req,res,next)=>{
    try {
        console.log(req.params)
        const {eventId}= req.params;
        const { studentId } = req.body;
        const Event=await Event.findById(eventId)
        if(!Event.status.equals("approved")){
            return next(CreateError(403, "Unauthorized to register this Event"));
        }
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            { $addToSet: { registerStudents: studentId } },
            { new: true, runValidators: true }
        );
        if (!updatedEvent) {
            return next(CreateError(404, "Event not found"));
        }
        return next(next(CreateSuccess(200, "Register Successfully", updatedEvent)))
    } catch (error) {
        return next(CreateError(500, error.message || "Internal Server Error"));
    }
}
export const getAllRegisteredStudent=async (req,res,next)=>{
    try {
        await new Promise((resolve, reject) => {
            verifyToken(req, res, (err) => {
                if (err) {
                    return reject(err);
                }
                if (req.user.roles[0].role !== 'mentor') {
                    return reject(CreateError(403, "You are not authorized!"));
                }
                resolve();
            });
        });
        const {eventId}= req.params;
        const studentIdList=await Event.findById(eventId).select('registerStudents').populate('registerStudents',"username email");
        return next(CreateSuccess(200, "Status Changed", studentIdList));
    } catch (error) {
        return next(CreateError(500, error.message || "Internal Server Error"));
    }
}

