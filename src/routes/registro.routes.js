import { Router } from "express";
import { getUsers,registro } from "../controllers/registro.controller.js";

const router = Router();

router.get("/registro", getUsers);
router.post("/registro", registro);



export default router;
