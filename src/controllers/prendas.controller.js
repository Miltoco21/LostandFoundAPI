import { pool } from "../db.js";
import { 
  sendStatusUpdateEmail,
  testEmailConfiguration,
  getAvailableStatuses 
} from '../utils/emailsender.js';

// Registrar nueva prenda
export const registroPrendas = async (req, res) => {
  try {
    const { nombre, rut, email, tipo_prenda, telefono, talla, estado, observaciones } = req.body;

    if (!nombre || !rut || !email || !tipo_prenda || !telefono || !talla || !estado) {
      return res.status(400).json({ 
        message: "Faltan campos obligatorios",
        required: ["nombre", "rut", "email", "tipo_prenda", "telefono", "talla", "estado"]
      });
    }

    const insertQuery = "INSERT INTO prendas(nombre, rut, email, tipo_prenda, telefono, talla, estado, observaciones) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
    const [rows] = await pool.query(insertQuery, [nombre, rut, email, tipo_prenda, telefono, talla, estado, observaciones]);
    
    res.status(201).json({
      message: "Prenda guardada con éxito",
      id: rows.insertId,
      prenda: {
        id: rows.insertId,
        nombre, 
        rut, 
        email, 
        tipo_prenda, 
        telefono, 
        talla, 
        estado, 
        observaciones,
        fecha_registro: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("Error al registrar prenda:", error);
    
    if (error.code === 'ER_DUP_ENTRY' && error.message.includes('PRIMARY')) {
      return res.status(500).json({
        message: "Error interno: problema con la generación de ID único"
      });
    }
    
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message
    });
  }
};

// Obtener todas las prendas
export const getPrendas = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM prendas ORDER BY fecha_registro DESC");
    res.status(200).json(rows);
    
  } catch (error) {
    console.error("Error al obtener prendas:", error);
    return res.status(500).json({
      message: "Error al obtener prendas",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
};

// Actualizar estado de devolución (PATCH)
export const updateEstadoDevolucion = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_devolucion } = req.body;

    if (!estado_devolucion) {
      return res.status(400).json({ 
        message: "El campo estado_devolucion es requerido" 
      });
    }

    // Obtener estado anterior
    const [prevStateRows] = await pool.query("SELECT estado_devolucion FROM prendas WHERE id = ?", [id]);
    const previousState = prevStateRows.length > 0 ? prevStateRows[0].estado_devolucion : null;

    // Actualizar estado
    const [result] = await pool.query(
      "UPDATE prendas SET estado_devolucion = ?, fecha_devolucion = NOW() WHERE id = ?",
      [estado_devolucion, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Prenda no encontrada" });
    }

    // Obtener datos de la prenda actualizada
    const [garmentRows] = await pool.query("SELECT * FROM prendas WHERE id = ?", [id]);
    
    // Enviar email si el estado cambió
    let emailStatus = { sent: false, reason: "Estado no cambió" };
    
    if (garmentRows.length > 0 && previousState !== estado_devolucion) {
      try {
        const emailResult = await sendStatusUpdateEmail(
          garmentRows[0].email, 
          garmentRows[0], 
          estado_devolucion
        );
        emailStatus = {
          sent: emailResult.sent,
          provider: emailResult.provider || 'resend',
          messageId: emailResult.messageId,
          reason: emailResult.reason
        };
      } catch (emailError) {
        console.error("Error al enviar email:", emailError);
        emailStatus = {
          sent: false,
          error: emailError.message
        };
      }
    }

    res.json({ 
      message: "Estado de devolución actualizado correctamente",
      affectedRows: result.affectedRows,
      emailStatus,
      estadoAnterior: previousState,
      estadoNuevo: estado_devolucion
    });

  } catch (error) {
    console.error("Error al actualizar estado:", error);
    return res.status(500).json({
      message: "Error al actualizar el estado",
      error: error.message
    });
  }
};

// Actualizar prenda completa (PUT)
export const updatePrenda = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, rut, email, tipo_prenda, telefono, talla, estado, observaciones, estado_devolucion } = req.body;

    if (!nombre || !rut || !email || !tipo_prenda || !telefono || !talla || !estado) {
      return res.status(400).json({ 
        message: "Faltan campos obligatorios",
        required: ["nombre", "rut", "email", "tipo_prenda", "telefono", "talla", "estado"]
      });
    }

    // Obtener estado anterior
    const [prevStateRows] = await pool.query("SELECT estado_devolucion FROM prendas WHERE id = ?", [id]);
    const previousState = prevStateRows.length > 0 ? prevStateRows[0].estado_devolucion : null;

    const fecha_devolucion = estado_devolucion ? new Date() : null;

    // Actualizar prenda
    const [result] = await pool.query(
      `UPDATE prendas 
       SET nombre = ?, rut = ?, email = ?, tipo_prenda = ?, telefono = ?, talla = ?, 
           estado = ?, observaciones = ?, estado_devolucion = ?, fecha_devolucion = ?
       WHERE id = ?`,
      [nombre, rut, email, tipo_prenda, telefono, talla, estado, observaciones, estado_devolucion, fecha_devolucion, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Prenda no encontrada" });
    }

    // Enviar email si el estado de devolución cambió
    let emailStatus = { sent: false, reason: "Estado de devolución no cambió o es nulo" };
    
    if (estado_devolucion && previousState !== estado_devolucion) {
      try {
        const updatedGarment = { id, nombre, rut, email, tipo_prenda, telefono, talla, estado, observaciones, estado_devolucion, fecha_devolucion };
        const emailResult = await sendStatusUpdateEmail(email, updatedGarment, estado_devolucion);
        
        emailStatus = {
          sent: emailResult.sent,
          provider: emailResult.provider || 'resend',
          messageId: emailResult.messageId,
          reason: emailResult.reason
        };
      } catch (emailError) {
        console.error("Error al enviar email:", emailError);
        emailStatus = {
          sent: false,
          error: emailError.message
        };
      }
    }

    res.json({ 
      message: "Prenda actualizada correctamente",
      affectedRows: result.affectedRows,
      emailStatus,
      estadoAnterior: previousState,
      estadoNuevo: estado_devolucion
    });

  } catch (error) {
    console.error("Error al actualizar prenda:", error);
    return res.status(500).json({
      message: "Error al actualizar la prenda",
      error: error.message
    });
  }
};

// Diagnóstico de emails
export const diagnosticoEmails = async (req, res) => {
  try {
    const configTest = await testEmailConfiguration();
    const availableStates = getAvailableStatuses();
    
    const envCheck = {
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      API_KEY_PREFIX: process.env.RESEND_API_KEY ? 
        process.env.RESEND_API_KEY.substring(0, 8) + '...' : 
        'NO_CONFIGURADO',
      STARTS_WITH_RE: process.env.RESEND_API_KEY ? 
        process.env.RESEND_API_KEY.startsWith('re_') : 
        false
    };
    
    res.json({
      message: "Diagnóstico de emails completado",
      timestamp: new Date().toISOString(),
      provider: "Resend",
      configuration: configTest,
      availableStates: availableStates,
      environment: envCheck,
      status: configTest.configured ? "✅ CONFIGURADO" : "❌ ERROR",
      warnings: !envCheck.STARTS_WITH_RE ? 
        ["⚠️ API key no comienza con 're_' - verifica que sea válida"] : 
        []
    });
    
  } catch (error) {
    console.error("Error en diagnóstico:", error);
    res.status(500).json({
      message: "Error en diagnóstico de emails",
      error: error.message
    });
  }
};

// Test de email
export const testEmail = async (req, res) => {
  try {
    const { email, estado, prendasDatos } = req.body;
    
    if (!email || !estado) {
      return res.status(400).json({
        message: "Se requieren 'email' y 'estado' en el body",
        example: {
          email: "usuario@example.com",
          estado: "Encontrada - Pendiente de devolución",
          prendasDatos: {
            id: 999,
            tipo_prenda: "Sudadera",
            talla: "M"
          }
        }
      });
    }
    
    const testGarment = prendasDatos || {
      id: 999,
      tipo_prenda: "Poleron TEST",
      talla: "M",
      estado: "Bueno",
      observaciones: "Prenda de prueba",
      nombre: "Usuario Test"
    };
    
    const emailResult = await sendStatusUpdateEmail(email, testGarment, estado);
    
    res.json({
      message: "Test de email completado",
      timestamp: new Date().toISOString(),
      provider: "Resend",
      emailResult: emailResult,
      testData: { email, estado, garment: testGarment },
      success: emailResult.sent,
      hint: emailResult.sent ? 
        `Revisa tu bandeja de entrada en ${email}` : 
        "Verifica la configuración y los logs"
    });
    
  } catch (error) {
    console.error("Error en test de email:", error);
    res.status(500).json({
      message: "Error en test de email",
      error: error.message
    });
  }
};