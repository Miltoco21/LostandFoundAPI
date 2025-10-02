// app.js
import express from 'express';
import cors from 'cors';
import prendasRoutes from './routes/prendas.routes.js'; // Check this path

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes BEFORE the 404 handler
app.use('/api/prendas', prendasRoutes);

// Basic routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// 404 Handler - MUST BE LAST
app.use('*', (req, res) => {
  res.status(404).json({
    message: "La ruta solicitada no existe",
    attempted: req.originalUrl
  });
});

export default app;