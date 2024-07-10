import express from "express";
import { CreateRole, UpdateRole, deleteRole, getAllRoles } from "../controllers/role.controller.js";

const router = express.Router();

router.post('/create', CreateRole);
router.put('/update/:id',UpdateRole );
router.get('/getAll',getAllRoles);
router.delete('/delete/:id',deleteRole);
export default router;