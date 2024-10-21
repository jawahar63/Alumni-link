import express from 'express'
import verifyToken, { verifyAlumni, verifyMentor } from '../middleware/verifyToken.js';
import { ChangeEventStatus, createEvent, deleteEvent, getAllApprovedEvent, getAllEvent, getAllRegisteredStudent, registerStudents, updateEvent } from '../controllers/event.controller.js';
import { routeByRole } from '../middleware/event.js';

const router =express.Router();
router.use(verifyToken);
router.post('/createEvent',verifyMentor,createEvent);
router.get('/getAllEvent',getAllEvent);
router.put('/updateEvent/:eventId',verifyMentor,updateEvent);
router.put('/changeEventStatus/:eventId/:alumniId',verifyAlumni,ChangeEventStatus);
router.put('/registerStudents/:eventId/:studentId',registerStudents);
router.get('/getAllRegisteredStudent/:eventId',getAllRegisteredStudent);
router.get('/getAllAprovedEvent/:studentId',getAllApprovedEvent);
router.get('/getEvent/:id',routeByRole);
router.delete('/deleteEvent/:eventId/:mentorId',verifyMentor,deleteEvent);
export default router