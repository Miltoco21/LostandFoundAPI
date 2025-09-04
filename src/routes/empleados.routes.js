import { Router } from "express";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesbyId,
} from "../controllers/empleados.controller.js";

const router = Router();
//router como metodo en reemplazo de routerp

router.get("/empleados", getEmployees);
router.get("/empleados/:id", getEmployeesbyId);
router.post("/empleados", createEmployee);
router.patch("/empleados/:id", updateEmployee);
router.delete("/empleados/:id", deleteEmployee);

export default router;
