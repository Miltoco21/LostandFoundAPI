// 
import { Router } from 'express';
import {
  registroPrendas,
  getPrendas,
  getPrendasByRut,
  updateEstadoDevolucion,
  updatePrenda // Importa la nueva función que crearemos
} from "../controllers/prendas.controller.js";

const router = Router();

// Middleware de logging específico para prendas
router.use((req, res, next) => {
  console.log(`🔄 PRENDAS ROUTE INTERCEPTED: ${req.method} ${req.originalUrl}`);
  console.log('📦 Body:', req.body);
  console.log('🎯 Base URL:', req.baseUrl);
  console.log('🛤️ Path:', req.path);
  next();
});

// Rutas - IMPORTANTE: estas son rutas relativas a /prendas
router.get("/", (req, res) => {
  if (req.query.rut) {
    getPrendasByRut(req, res);
  } else {
    getPrendas(req, res);
  }
});

router.post("/", registroPrendas);
router.put("/:id/estado", updateEstadoDevolucion);
router.put("/:id", updatePrenda); // Nueva ruta para actualizar prenda completa

// Ruta de prueba
router.get("/test", (req, res) => {
  console.log("✅ Ruta de prueba de prendas alcanzada");
  res.json({ message: "Ruta de prendas funcionando correctamente" });
});

console.log("📋 Rutas de prendas cargadas:");
console.log("   GET  /");
console.log("   POST /");
console.log("   PUT  /:id/estado");
console.log("   PUT  /:id"); // Nueva ruta
console.log("   GET  /test");

export default router;