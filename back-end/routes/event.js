import express from 'express'
import verifyToken, { verifyMentor } from '../middleware/verifyToken.js';
import { ChangeEventStatus, createEvent, getAllApprovedEvent, getAllEvent, getAllRegisteredStudent, registerStudents, updateEvent } from '../controllers/event.controller.js';
import { routeByRole } from '../middleware/event.js';

const router =express.Router();
router.use(verifyToken);
router.post('/createEvent',createEvent);
router.get('/getAllEvent',getAllEvent);
router.put('updateEvent/:eventId/:mentorId',updateEvent);
router.put('/changeEventStatus/:eventId/:alumniId',ChangeEventStatus);
router.put('/registerStudents/:eventId/:studentId',registerStudents);
router.get('/getAllRegisteredStudent/:eventId',getAllRegisteredStudent);
router.get('/getAllAprovedEvent/:studentId',getAllApprovedEvent);
router.get('/getEvent/:id',routeByRole);
export default router