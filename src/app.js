// import express from 'express';
// import cors from 'cors';
// import prendasRoutes from './routes/prendas.routes.js';
// import { PORT } from './config.js'

// const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Rutas
// app.use('/api/prendas', prendasRoutes);

// // Ruta de prueba
// app.get('/', (req, res) => {
//   res.json({ 
//     message: 'API de Prendas Lost & Found',
//     status: 'online',
//     endpoints: {
//       'POST /api/prendas': 'Crear nueva prenda',
//       'GET /api/prendas': 'Obtener todas las prendas',
//       'GET /api/prendas/rut/:rut': 'Buscar prendas por RUT',
//       'GET /api/prendas/:id': 'Obtener prenda por ID',
//       'PUT /api/prendas/:id': 'Actualizar prenda',
//       'DELETE /api/prendas/:id': 'Eliminar prenda'
//     }
//   });
// });

// // Manejo de rutas no encontradas
// app.use((req, res) => {
//   res.status(404).json({ 
//     error: 'Ruta no encontrada',
//     path: req.path 
//   });
// });

// // Manejo de errores
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ 
//     error: 'Error interno del servidor',
//     message: err.message 
//   });
// });



// app.listen(PORT, () => {
//   console.log(`Servidor corriendo en puerto ${PORT}`);
// });

// export default app;
import express from 'express';
import cors from 'cors';
import prendasRoutes from './routes/prendas.routes.js';
import { PORT } from './config.js';

const app = express();

// ✅ CORS debe ser lo primero
app.use(cors({
  origin: '*', // En producción, especifica tu dominio
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Body parsers ANTES de las rutas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Logging middleware para debugging
app.use((req, res, next) => {
  console.log(`\n${new Date().toISOString()}`);
  console.log(`📨 ${req.method} ${req.path}`);
  console.log('📋 Headers:', req.headers['content-type']);
  console.log('📦 Body:', req.body);
  next();
});

// ✅ Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ✅ Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Prendas Lost & Found',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      info: 'GET /api/prendas/info',
      crear: 'POST /api/prendas',
      obtener: 'GET /api/prendas',
      buscarPorRut: 'GET /api/prendas/rut/:rut',
      obtenerPorId: 'GET /api/prendas/:id',
      actualizar: 'PUT /api/prendas/:id',
      eliminar: 'DELETE /api/prendas/:id'
    }
  });
});

// ✅ Montar rutas de prendas
app.use('/api/prendas', prendasRoutes);

// ✅ Manejo de rutas no encontradas (DEBE ir al final)
app.use((req, res) => {
  console.error(`❌ 404 - Ruta no encontrada: ${req.method} ${req.path}`);
  res.status(404).json({ 
    message: 'La ruta solicitada no existe',
    attempted: req.path,
    method: req.method,
    debug: {
      originalUrl: req.originalUrl,
      path: req.path,
      baseUrl: req.baseUrl,
      routesFound: 0
    },
    availableRoutes: {
      health: 'GET /health',
      info: 'GET /',
      prendas: 'GET|POST /api/prendas (si está funcionando)'
    }
  });
});

// ✅ Manejo de errores (DEBE ir al final)
app.use((err, req, res, next) => {
  console.error('💥 Error en el servidor:');
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message,
    path: req.path
  });
});

// ✅ Iniciar servidor
app.listen(PORT, () => {
  console.log('\n🚀 ====================================');
  console.log(`   Servidor corriendo en puerto ${PORT}`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`   Env: ${process.env.NODE_ENV || 'development'}`);
  console.log('🚀 ====================================\n');
});

export default app;