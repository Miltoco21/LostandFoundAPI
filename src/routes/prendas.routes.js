import { Router } from "express";
import { 
  crearPrenda,
  obtenerPrendas,
  obtenerPrendaPorId,
  buscarPorRut,
  actualizarPrenda,
  eliminarPrenda
} from "../controllers/prendas.controller.js";

const router = Router();

// ========== CRUD DE PRENDAS ==========
router.post("/", crearPrenda);             // POST   /api/prendas
router.get("/", obtenerPrendas);           // GET    /api/prendas
router.get("/rut/:rut", buscarPorRut);     // GET    /api/prendas/rut/:rut
router.get("/:id", obtenerPrendaPorId);    // GET    /api/prendas/:id
router.put("/:id", actualizarPrenda);      // PUT    /api/prendas/:id
router.delete("/:id", eliminarPrenda);     // DELETE /api/prendas/:id

export default router;