import { Router } from 'express';
import {
  registroPrendas,
  getPrendas,
  getPrendasByRut,
  updateEstadoDevolucion,
  updatePrenda
} from "../controllers/prendas.controller.js";

const router = Router();

// Middleware de logging específico para prendas
router.use((req, res, next) => {
  console.log(`🔄 PRENDAS ROUTE INTERCEPTED: ${req.method} ${req.originalUrl}`);
  console.log('📦 Body:', req.body);
  console.log('🎯 Base URL:', req.baseUrl);
  console.log('🛤️ Path:', req.path);
  console.log('🔍 Query params:', req.query);
  next();
});

// IMPORTANTE: Rutas específicas ANTES que rutas generales
// Ruta de prueba DEBE ir ANTES que GET /
router.get("/test", (req, res) => {
  console.log("✅ Ruta de prueba de prendas alcanzada");
  res.json({ 
    message: "Ruta de prendas funcionando correctamente",
    timestamp: new Date().toISOString(),
    query: req.query,
    path: req.path,
    originalUrl: req.originalUrl
  });
});

// Rutas específicas con parámetros
router.put("/:id/estado", updateEstadoDevolucion);
router.put("/:id", updatePrenda);

// Rutas POST
router.post("/", registroPrendas);

// Ruta GET general - DEBE IR AL FINAL
router.get("/", async (req, res) => {
  console.log("🎯 ROUTER GET / EJECUTÁNDOSE");
  console.log("📋 RUT query param:", req.query.rut);
  
  try {
    if (req.query.rut) {
      console.log("🔄 Ejecutando getPrendasByRut con RUT:", req.query.rut);
      await getPrendasByRut(req, res);
    } else {
      console.log("🔄 Ejecutando getPrendas (sin RUT)");
      await getPrendas(req, res);
    }
  } catch (error) {
    console.error("💥 ERROR EN ROUTER:", error);
    res.status(500).json({
      error: "Error en el router",
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

console.log("📋 Rutas de prendas cargadas:");
console.log("   GET  /");
console.log("   POST /");
console.log("   PUT  /:id/estado");
console.log("   PUT  /:id");
console.log("   GET  /test");

export default router;