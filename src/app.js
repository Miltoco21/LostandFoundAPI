import express, { json } from "express";
import rutaIndex from '../src/routes/index.routes.js'
import rutaPrendas from "../src/routes/prendas.routes.js"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

// Middleware de logging global
app.use((req, res, next) => {
  console.log(`🌐 GLOBAL: ${req.method} ${req.url}`);
  console.log('📍 Path:', req.path);
  console.log('📦 Query:', req.query);
  console.log('📦 Body:', req.body);
  next();
});

// Ruta de salud
app.get('/health', (req, res) => {
  console.log('💚 Health check solicitado');
  res.status(200).json({
    status: 'OK',
    message: 'Lost & Found API funcionando',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  console.log('🏠 Ruta raíz solicitada');
  res.json({
    message: '🚀 Lost & Found API',
    status: 'Activa',
    version: '1.0.0',
    endpoints: {
      prendas: '/api/prendas',
      health: '/health'
    }
  });
});

// Registrar rutas CON prefijo /api
console.log("🚀 Registrando rutas...");

// ✅ Ruta principal de prendas
app.use('/api/prendas', rutaPrendas);

console.log("✅ Rutas registradas:");
console.log("   /api/prendas ← ESTA ES LA CORRECTA");

// ❌ REMOVIDO: Este middleware causaba el error
// app.use('/api/*', (req, res, next) => { ... });

// Middleware para rutas no encontradas
app.use((req, res, next) => {
  console.log(`❌ RUTA NO ENCONTRADA: ${req.method} ${req.url}`);
  
  // Log de rutas disponibles para debug
  console.log('🔍 Rutas disponibles:');
  console.log('   GET /health - Estado del servidor');
  console.log('   GET / - Información de la API');
  console.log('   GET /api/prendas - Listar prendas');
  console.log('   POST /api/prendas - Crear prenda');
  console.log('   PUT /api/prendas/:id - Actualizar prenda');
  console.log('   PUT /api/prendas/:id/estado - Cambiar estado');
  console.log('   GET /api/prendas/test - Ruta de prueba');
  
  res.status(404).json({
    message: 'La ruta solicitada no existe',
    attempted: req.url,
    method: req.method,
    availableRoutes: {
      health: 'GET /health',
      info: 'GET /',
      prendas: 'GET|POST /api/prendas',
      prendasById: 'PUT /api/prendas/:id',
      prendasState: 'PUT /api/prendas/:id/estado',
      test: 'GET /api/prendas/test'
    },
    tip: 'Verifique que esté usando el prefijo /api/ para endpoints de la API'
  });
});

// Manejo global de errores
app.use((error, req, res, next) => {
  console.error('💥 Error global capturado:', error);
  console.error('📍 En ruta:', req.url);
  console.error('🔧 Método:', req.method);
  
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo salió mal',
    path: req.url,
    method: req.method
  });
});

export default app