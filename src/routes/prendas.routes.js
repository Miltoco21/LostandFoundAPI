// prendasRoutes.js
import { Router } from 'express';
import {
  getPrendas,
  getPrendasByRut,
  registroPrendas,
  updatePrenda,
  updateEstadoDevolucion,
  diagnosticoEmails,
  testEmail
} from '../controllers/prendas.controller'; // Adjust the import path as needed

const router = Router();

// Define all your routes here
router.get('/', getPrendas); // GET /api/prendas
router.get('/buscar', getPrendasByRut); // GET /api/prendas/buscar?rut=...
router.post('/', registroPrendas); // POST /api/prendas
router.put('/:id', updatePrenda); // PUT /api/prendas/1
router.patch('/:id/estado', updateEstadoDevolucion); // PATCH /api/prendas/1/estado

// Diagnostic routes
router.get('/diagnostico/emails', diagnosticoEmails);
router.post('/test-email', testEmail);

export default router;