import { Router } from "express";
import { 
  buscarPorRut, 
  buscarPorEmail, 
  buscarPorTipo,
  busquedaAvanzada 
} from "../controllers/searchController.js";

const router = Router();

// ========== BÚSQUEDAS DE PRENDAS ==========

// GET /api/buscar?rut=12345678-9
// Buscar todas las prendas asociadas a un RUT específico
router.get("/buscar", buscarPorRut);

// GET /api/buscar-email?email=usuario@example.com
// Buscar todas las prendas asociadas a un email
router.get("/buscar-email", buscarPorEmail);

// GET /api/buscar-tipo?tipo=Poleron
// Buscar prendas por tipo (búsqueda parcial con LIKE)
router.get("/buscar-tipo", buscarPorTipo);

// GET /api/buscar-avanzada?rut=12345678-9&tipo_prenda=Poleron&estado_devolucion=Devuelta
// Búsqueda combinada con múltiples filtros
router.get("/buscar-avanzada", busquedaAvanzada);

export default router;