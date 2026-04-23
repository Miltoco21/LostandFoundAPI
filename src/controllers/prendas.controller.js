// controllers/prendas.controller.js
import { pool } from '../db.js';
import { sendStatusUpdateEmail } from '../utils/emailsender.js';


// Crear nueva prenda
const crearPrenda = async (req, res) => {
  try {
    const {
      rut,
      tipo_prenda,
      nombre,
      telefono,
      email,
      talla,
      observaciones,
      estado,
      estado_devolucion,
      fecha_devolucion
    } = req.body;

    // Validación básica
    if (!rut || !tipo_prenda || !nombre) {
      return res.status(400).json({ 
        error: 'Los campos rut, tipo_prenda y nombre son obligatorios' 
      });
    }

    const query = `
      INSERT INTO prendas 
      (rut, tipo_prenda, nombre, telefono, email, talla, observaciones, estado, estado_devolucion, fecha_devolucion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      rut,
      tipo_prenda,
      nombre,
      telefono || null,
      email || null,
      talla || null,
      observaciones || null,
      estado || 'Pendiente',
      estado_devolucion || 'No devuelta',
      fecha_devolucion || null
    ]);

    res.status(201).json({
      message: 'Prenda creada exitosamente',
      id: result.insertId,
      data: {
        id: result.insertId,
        rut,
        tipo_prenda,
        nombre,
        telefono,
        email,
        talla,
        observaciones,
        estado: estado || 'Pendiente',
        estado_devolucion: estado_devolucion || 'No devuelta',
        fecha_devolucion
      }
    });
  } catch (error) {
    console.error('Error al crear prenda:', error);
    res.status(500).json({ 
      error: 'Error al crear la prenda',
      message: error.message 
    });
  }
};

// Obtener todas las prendas
const obtenerPrendas = async (req, res) => {
  try {
    const { estado, estado_devolucion, limit = 100, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM prendas WHERE 1=1';
    const params = [];

    if (estado) {
      query += ' AND estado = ?';
      params.push(estado);
    }

    if (estado_devolucion) {
      query += ' AND estado_devolucion = ?';
      params.push(estado_devolucion);
    }

    query += ' ORDER BY fecha_registro DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [prendas] = await pool.execute(query, params);

    res.json({
      success: true,
      count: prendas.length,
      data: prendas
    });
  } catch (error) {
    console.error('Error al obtener prendas:', error);
    res.status(500).json({ 
      error: 'Error al obtener las prendas',
      message: error.message 
    });
  }
};

// Obtener prenda por ID
const obtenerPrendaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'SELECT * FROM prendas WHERE id = ?';
    const [prendas] = await pool.execute(query, [id]);

    if (prendas.length === 0) {
      return res.status(404).json({ 
        error: 'Prenda no encontrada' 
      });
    }

    res.json({
      success: true,
      data: prendas[0]
    });
  } catch (error) {
    console.error('Error al obtener prenda:', error);
    res.status(500).json({ 
      error: 'Error al obtener la prenda',
      message: error.message 
    });
  }
};

// Buscar prendas por RUT
const buscarPorRut = async (req, res) => {
  try {
    const { rut } = req.params;

    if (!rut) {
      return res.status(400).json({ 
        error: 'El RUT es obligatorio' 
      });
    }

    const query = 'SELECT * FROM prendas WHERE rut = ? ORDER BY fecha_registro DESC';
    const [prendas] = await pool.execute(query, [rut]);

    res.json({
      success: true,
      count: prendas.length,
      rut: rut,
      data: prendas
    });
  } catch (error) {
    console.error('Error al buscar por RUT:', error);
    res.status(500).json({ 
      error: 'Error al buscar prendas por RUT',
      message: error.message 
    });
  }
};

// Actualizar prenda
const actualizarPrenda = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      rut,
      tipo_prenda,
      nombre,
      telefono,
      email,
      talla,
      observaciones,
      estado,
      estado_devolucion,
      fecha_devolucion
    } = req.body;

    // Verificar si existe
    const [exists] = await pool.execute('SELECT id FROM prendas WHERE id = ?', [id]);
    
    if (exists.length === 0) {
      return res.status(404).json({ 
        error: 'Prenda no encontrada' 
      });
    }

    const query = `
      UPDATE prendas SET
        rut = COALESCE(?, rut),
        tipo_prenda = COALESCE(?, tipo_prenda),
        nombre = COALESCE(?, nombre),
        telefono = COALESCE(?, telefono),
        email = COALESCE(?, email),
        talla = COALESCE(?, talla),
        observaciones = COALESCE(?, observaciones),
        estado = COALESCE(?, estado),
        estado_devolucion = COALESCE(?, estado_devolucion),
        fecha_devolucion = COALESCE(?, fecha_devolucion)
      WHERE id = ?
    `;

    await pool.execute(query, [
      rut ?? null,
      tipo_prenda ?? null,
      nombre ?? null,
      telefono ?? null,
      email ?? null,
      talla ?? null,
      observaciones ?? null,
      estado ?? null,
      estado_devolucion ?? null,
      fecha_devolucion ?? null,
      id
    ]);

    // Obtener el registro actualizado
    const [updated] = await pool.execute('SELECT * FROM prendas WHERE id = ?', [id]);
    const updatedPrenda = updated[0];
    console.log('📋 Email encontrado:', updatedPrenda.email);
console.log('📋 Estado devolucion:', estado_devolucion);

    // Enviar email si hay email registrado y se actualizó el estado_devolucion
    let emailStatus = null;
    if (updatedPrenda.email && estado_devolucion) {
      console.log(`📧 Enviando email a ${updatedPrenda.email} para estado: "${estado_devolucion}"`);
      emailStatus = await sendStatusUpdateEmail(
        updatedPrenda.email,
        updatedPrenda,
        estado_devolucion
      );
      console.log('📬 Resultado del email:', emailStatus);
    } else {
      console.log('⚠️ Email no enviado:', !updatedPrenda.email ? 'sin email registrado en la prenda' : 'no se recibió estado_devolucion');
    }

    res.json({
      success: true,
      message: 'Prenda actualizada exitosamente',
      data: updatedPrenda,
      emailStatus
    });

  } catch (error) {
    console.error('Error al actualizar prenda:', error);
    res.status(500).json({ 
      error: 'Error al actualizar la prenda',
      message: error.message 
    });
  }
};
// const actualizarPrenda = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       rut,
//       tipo_prenda,
//       nombre,
//       telefono,
//       email,
//       talla,
//       observaciones,
//       estado,
//       estado_devolucion,
//       fecha_devolucion
//     } = req.body;

//     // Verificar si existe
//     const [exists] = await pool.execute('SELECT id FROM prendas WHERE id = ?', [id]);
    
//     if (exists.length === 0) {
//       return res.status(404).json({ 
//         error: 'Prenda no encontrada' 
//       });
//     }

//     const query = `
//       UPDATE prendas SET
//         rut = COALESCE(?, rut),
//         tipo_prenda = COALESCE(?, tipo_prenda),
//         nombre = COALESCE(?, nombre),
//         telefono = COALESCE(?, telefono),
//         email = COALESCE(?, email),
//         talla = COALESCE(?, talla),
//         observaciones = COALESCE(?, observaciones),
//         estado = COALESCE(?, estado),
//         estado_devolucion = COALESCE(?, estado_devolucion),
//         fecha_devolucion = COALESCE(?, fecha_devolucion)
//       WHERE id = ?
//     `;

//     // await pool.execute(query, [
//     //   rut,
//     //   tipo_prenda,
//     //   nombre,
//     //   telefono,
//     //   email,
//     //   talla,
//     //   observaciones,
//     //   estado,
//     //   estado_devolucion,
//     //   fecha_devolucion,
//     //   id
//     // ]);
//     await pool.execute(query, [
//       rut ?? null,           // ← convierte undefined a null
//       tipo_prenda ?? null,
//       nombre ?? null,
//       telefono ?? null,
//       email ?? null,
//       talla ?? null,
//       observaciones ?? null,
//       estado ?? null,
//       estado_devolucion ?? null,
//       fecha_devolucion ?? null,
//       id
//     ]);

//     // Obtener el registro actualizado
//     const [updated] = await pool.execute('SELECT * FROM prendas WHERE id = ?', [id]);

//     res.json({
//       success: true,
//       message: 'Prenda actualizada exitosamente',
//       data: updated[0]
//     });
//   } catch (error) {
//     console.error('Error al actualizar prenda:', error);
//     res.status(500).json({ 
//       error: 'Error al actualizar la prenda',
//       message: error.message 
//     });
//   }
// };

// Eliminar prenda
const eliminarPrenda = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM prendas WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        error: 'Prenda no encontrada' 
      });
    }

    res.json({
      success: true,
      message: 'Prenda eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar prenda:', error);
    res.status(500).json({ 
      error: 'Error al eliminar la prenda',
      message: error.message 
    });
  }
};

export {
  crearPrenda,
  obtenerPrendas,
  obtenerPrendaPorId,
  buscarPorRut,
  actualizarPrenda,
  eliminarPrenda
};