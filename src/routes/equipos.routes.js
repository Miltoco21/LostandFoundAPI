import { Router } from "express";
import { getEquipos,registroEquipos,editarEquipo,eliminarEquipo } from "../controllers/equipos.controller.js";

const router = Router();

router.get("/equipos", getEquipos);
router.post("/equipos", registroEquipos);
router.put("/equipos/:id", (req, res, next) => {
  console.log("ID recibido:", req.params.id);
  next();
}, editarEquipo);

// router.put("/equipos/:id", editarEquipo);
router.delete("/equipos/:id", eliminarEquipo);




export default router;
