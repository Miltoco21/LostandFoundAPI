import { Router } from "express";
import { 
  registroPrendas,
  getPrendas,
  updateEstadoDevolucion,
  updatePrenda,
  diagnosticoEmails,
  testEmail
} from "../controllers/prendas.controller.js";

const router = Router();

// ========== CRUD DE PRENDAS ==========

// POST /api/prendas - Registrar nueva prenda
router.post("/prendas", registroPrendas);

// GET /api/prendas - Obtener todas las prendas
router.get("/prendas", getPrendas);

// PUT /api/prendas/:id - Actualizar prenda completa
router.put("/prendas/:id", updatePrenda);

// PATCH /api/prendas/:id/estado - Actualizar solo estado de devolución
router.patch("/prendas/:id/estado", updateEstadoDevolucion);

// ========== DIAGNÓSTICO Y TESTING ==========

// GET /api/diagnostico-emails - Verificar configuración de emails
router.get("/diagnostico-emails", diagnosticoEmails);

// POST /api/test-email - Enviar email de prueba
router.post("/test-email", testEmail);

export default router;