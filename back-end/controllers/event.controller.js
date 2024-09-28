import verifyToken from "../middleware/verifyToken.js";
import Event from "../models/event.js";
import { CreateError } from "../utils/error.js"
import { CreateSuccess } from "../utils/success.js";



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
            venue: req.body.venue
        });

        await newEvent.save();
        // Emit event (uncomment if necessary)
        io.emit('newEvent', newEvent);
        
        return next(CreateSuccess(200, "Event Created Successfully", newEvent));
    } catch (error) {
        return next(CreateError(500, error.message || "Internal Server Error"));
    }
};

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
        const {mentorId}=re.body;
        const events = (await Event.find({createdBy:mentorId}))
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
        const {alumniId}=req.body;
        const events = (await Event.find({alumniId:alumniId}))
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
        const {studentId} =req.body;
        const events = (await Event.find({registerStudents:studentId}))
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
        const {eventId,status,description} =req.body;
        const event =await Event.findById(eventId);
        event.status=status;
        event.description=description;
        await event.save();
        return next(CreateSuccess(200, "Status Changed", event));
    } catch (error) {
        return next(CreateError(500, error.message || "Internal Server Error"));
    }
}
