import { Router } from "express";
import {
  getUsers,
  createUsers,
  
} from "../controllers/usuarios.controller.js";

const router = Router();
//router como metodo en reemplazo de routerp

router.get("/usuarios", getUsers);
//router.get("/empleados/:id", getEmployeesbyId);
router.post("/usuarios", createUsers);


export default router;
