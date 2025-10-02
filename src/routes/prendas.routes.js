// // import { Router } from 'express';

// // // TEMPORALMENTE comentamos las importaciones del controlador
// // import {
// //   registroPrendas,
// //   getPrendas,
// //   getPrendasByRut,
// //   updateEstadoDevolucion,
// //   updatePrenda
// // } from "../controllers/prendas.controller.js";

// // const router = Router();

// // console.log("🚀 INICIANDO ROUTER DE PRENDAS");

// // // Middleware de logging específico para prendas
// // router.use((req, res, next) => {
// //   console.log(`🔄 PRENDAS ROUTE INTERCEPTED: ${req.method} ${req.originalUrl}`);
// //   console.log('📦 Body:', req.body);
// //   console.log('🎯 Base URL:', req.baseUrl);
// //   console.log('🛤️ Path:', req.path);
// //   console.log('🔍 Query params:', req.query);
// //   next();
// // });

// // // Ruta de prueba SIMPLE
// // router.get("/test", (req, res) => {
// //   console.log("✅ Ruta de prueba de prendas alcanzada");
// //   res.status(200).json({ 
// //     message: "🎉 Ruta de prendas funcionando correctamente",
// //     timestamp: new Date().toISOString(),
// //     query: req.query,
// //     path: req.path,
// //     originalUrl: req.originalUrl,
// //     method: req.method,
// //     baseUrl: req.baseUrl
// //   });
// // });

// // // Ruta GET simple sin controladores
// // router.get("/", (req, res) => {
// //   console.log("🎯 ROUTER GET / EJECUTÁNDOSE");
// //   console.log("📋 RUT query param:", req.query.rut);
  
// //   res.status(200).json({
// //     message: "Router básico funcionando",
// //     rut: req.query.rut || null,
// //     timestamp: new Date().toISOString(),
// //     status: "OK - Sin controladores por ahora"
// //   });
// // });

// // // Rutas POST, PUT temporalmente deshabilitadas
// // router.post("/", registroPrendas);
// // router.put("/:id/estado", updateEstadoDevolucion);
// // router.put("/:id", updatePrenda);

// // router.post("/", (req, res) => {
// //   res.status(200).json({ message: "POST funcionando - controlador deshabilitado temporalmente" });
// // });

// // router.put("/:id", (req, res) => {
// //   res.status(200).json({ message: "PUT /:id funcionando - controlador deshabilitado temporalmente" });
// // });

// // router.put("/:id/estado", (req, res) => {
// //   res.status(200).json({ message: "PUT /:id/estado funcionando - controlador deshabilitado temporalmente" });
// // });

// // console.log("📋 Rutas de prendas cargadas (versión simplificada):");
// // console.log("   GET  / - Respuesta básica");
// // console.log("   POST / - Respuesta básica");
// // console.log("   PUT  /:id/estado - Respuesta básica");
// // console.log("   PUT  /:id - Respuesta básica");
// // console.log("   GET  /test - Respuesta básica");

// // console.log("✅ ROUTER DE PRENDAS CONFIGURADO EXITOSAMENTE");

// // export default router;
// import { Router } from 'express';
// import { 
//   registroPrendas, 
//   getPrendas, 
//   getPrendasByRut, 
//   updatePrenda, 
//   updateEstadoDevolucion,
//   diagnosticoEmails,
//   testEmail
// } from '../controllers/prendas.controller.js';

// const router = Router();

// // RUTAS PRINCIPALES - SIN CONFLICTOS
// router.post('/', registroPrendas);
// router.get('/diagnostico-emails', diagnosticoEmails);
// router.post('/test-email', testEmail);
// router.put('/:id', updatePrenda);
// router.patch('/:id/estado-devolucion', updateEstadoDevolucion);

// // RUTA ESPECÍFICA PARA BUSCAR POR RUT - EVITAR AMBIGÜEDAD
// router.get('/buscar', getPrendasByRut); // Cambiado de '/' a '/buscar'

// // RUTA PARA OBTENER TODAS LAS PRENDAS - DEBE IR AL FINAL
// router.get('/', getPrendas);

// export default router;
import { Router } from 'express';
import { 
  registroPrendas, 
  getPrendas, 
  getPrendasByRut, 
  updatePrenda, 
  updateEstadoDevolucion,
  diagnosticoEmails,
  testEmail
} from '../controllers/prendas.controller.js';

const router = Router();

console.log("🚀 Configurando rutas de prendas...");

// ========== RUTAS ESPECÍFICAS (DEBEN IR PRIMERO) ==========

// Diagnóstico de emails
router.get('/diagnostico-emails', diagnosticoEmails);
console.log("✅ Ruta GET /prendas/diagnostico-emails registrada");

// Test de email
router.post('/test-email', testEmail);
console.log("✅ Ruta POST /prendas/test-email registrada");

// Buscar por RUT - RUTA ESPECÍFICA
router.get('/buscar', getPrendasByRut);
console.log("✅ Ruta GET /prendas/buscar?rut=... registrada");

// ========== RUTAS CON PARÁMETROS ==========

// Actualizar estado de devolución
router.patch('/:id/estado-devolucion', updateEstadoDevolucion);
console.log("✅ Ruta PATCH /prendas/:id/estado-devolucion registrada");

// Actualizar prenda completa
router.put('/:id', updatePrenda);
console.log("✅ Ruta PUT /prendas/:id registrada");

// ========== RUTAS GENERALES (DEBEN IR AL FINAL) ==========

// Crear nueva prenda
router.post('/', registroPrendas);
console.log("✅ Ruta POST /prendas registrada");

// Obtener todas las prendas
router.get('/', getPrendas);
console.log("✅ Ruta GET /prendas registrada");

console.log("📋 Resumen de rutas configuradas:");
console.log("   GET    /prendas                        → Obtener todas las prendas");
console.log("   GET    /prendas/buscar?rut=X           → Buscar por RUT");
console.log("   GET    /prendas/diagnostico-emails     → Verificar config de Resend");
console.log("   POST   /prendas                        → Crear nueva prenda");
console.log("   POST   /prendas/test-email             → Probar envío de email");
console.log("   PUT    /prendas/:id                    → Actualizar prenda completa");
console.log("   PATCH  /prendas/:id/estado-devolucion  → Actualizar solo estado");

export default router;