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

// Rutas - IMPORTANTE: estas son rutas relativas a /prendas
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

router.post("/", registroPrendas);
router.put("/:id/estado", updateEstadoDevolucion);
router.put("/:id", updatePrenda);

// Ruta de prueba
router.get("/test", (req, res) => {
  console.log("✅ Ruta de prueba de prendas alcanzada");
  res.json({ 
    message: "Ruta de prendas funcionando correctamente",
    timestamp: new Date().toISOString(),
    query: req.query
  });
});

console.log("📋 Rutas de prendas cargadas:");
console.log("   GET  /");
console.log("   POST /");
console.log("   PUT  /:id/estado");
console.log("   PUT  /:id");
console.log("   GET  /test");

export default router;