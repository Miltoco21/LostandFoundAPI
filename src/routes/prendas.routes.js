import { Router } from 'express';

// TEMPORALMENTE comentamos las importaciones del controlador
import {
  registroPrendas,
  getPrendas,
  getPrendasByRut,
  updateEstadoDevolucion,
  updatePrenda
} from "../controllers/prendas.controller.js";

const router = Router();

console.log("🚀 INICIANDO ROUTER DE PRENDAS");

// Middleware de logging específico para prendas
router.use((req, res, next) => {
  console.log(`🔄 PRENDAS ROUTE INTERCEPTED: ${req.method} ${req.originalUrl}`);
  console.log('📦 Body:', req.body);
  console.log('🎯 Base URL:', req.baseUrl);
  console.log('🛤️ Path:', req.path);
  console.log('🔍 Query params:', req.query);
  next();
});

// Ruta de prueba SIMPLE
router.get("/test", (req, res) => {
  console.log("✅ Ruta de prueba de prendas alcanzada");
  res.status(200).json({ 
    message: "🎉 Ruta de prendas funcionando correctamente",
    timestamp: new Date().toISOString(),
    query: req.query,
    path: req.path,
    originalUrl: req.originalUrl,
    method: req.method,
    baseUrl: req.baseUrl
  });
});

// Ruta GET simple sin controladores
router.get("/", (req, res) => {
  console.log("🎯 ROUTER GET / EJECUTÁNDOSE");
  console.log("📋 RUT query param:", req.query.rut);
  
  res.status(200).json({
    message: "Router básico funcionando",
    rut: req.query.rut || null,
    timestamp: new Date().toISOString(),
    status: "OK - Sin controladores por ahora"
  });
});

// Rutas POST, PUT temporalmente deshabilitadas
router.post("/", registroPrendas);
router.put("/:id/estado", updateEstadoDevolucion);
router.put("/:id", updatePrenda);

router.post("/", (req, res) => {
  res.status(200).json({ message: "POST funcionando - controlador deshabilitado temporalmente" });
});

router.put("/:id", (req, res) => {
  res.status(200).json({ message: "PUT /:id funcionando - controlador deshabilitado temporalmente" });
});

router.put("/:id/estado", (req, res) => {
  res.status(200).json({ message: "PUT /:id/estado funcionando - controlador deshabilitado temporalmente" });
});

console.log("📋 Rutas de prendas cargadas (versión simplificada):");
console.log("   GET  / - Respuesta básica");
console.log("   POST / - Respuesta básica");
console.log("   PUT  /:id/estado - Respuesta básica");
console.log("   PUT  /:id - Respuesta básica");
console.log("   GET  /test - Respuesta básica");

console.log("✅ ROUTER DE PRENDAS CONFIGURADO EXITOSAMENTE");

export default router;