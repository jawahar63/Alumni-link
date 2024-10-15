import { getAllEventByAlumni, getAllEventCreatedByMentor, getAllEventRegisterByStudent } from "../controllers/event.controller.js";
import { CreateError } from "../utils/error.js";
import verifyToken from "./verifyToken.js";

export const routeByRole = (req, res, next) => {
    verifyToken(req, res, () => {
        const userRole = req.user.roles[0].role;

        if (userRole === 'mentor') {
            return getAllEventCreatedByMentor(req, res, next);
        } else if (userRole === 'alumni') {
            return getAllEventByAlumni(req, res, next);
        } else if (userRole === 'User') {
            return getAllEventRegisterByStudent(req, res, next);
        } else {
            return next(CreateError(403, "You are not authorized!"));
        }
    });
};

