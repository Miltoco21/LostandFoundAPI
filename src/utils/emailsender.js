// emailsender.js - Sistema de plantillas dinámicas por estado - VERSIÓN CORREGIDA
import nodemailer from 'nodemailer';

// Configuración del transporter - CORREGIDO: createTransport (no createTransporter)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Plantillas de email por estado - MEJORADAS CON LOGGING
const emailTemplates = {
  "Encontrada - Pendiente de devolución": {
    subject: "¡Tu prenda ha sido encontrada! 🎉",
    template: (garmentDetails) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1976d2, #42a5f5); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">¡Excelente noticia! 🎉</h1>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            ¡Hemos encontrado tu prenda! Ya está disponible para ser reclamada en nuestra oficina de objetos perdidos.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1976d2;">
            <h3 style="color: #1976d2; margin-top: 0;">📋 Detalles de tu prenda:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Tipo:</td><td style="padding: 5px 0;">${garmentDetails.tipo_prenda}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Talla:</td><td style="padding: 5px 0;">${garmentDetails.talla}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Estado:</td><td style="padding: 5px 0;">${garmentDetails.estado}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Fecha encontrada:</td><td style="padding: 5px 0;">${new Date().toLocaleDateString('es-ES')}</td></tr>
              ${garmentDetails.observaciones ? `<tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Observaciones:</td><td style="padding: 5px 0;">${garmentDetails.observaciones}</td></tr>` : ''}
            </table>
          </div>

          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #2e7d32; margin-top: 0;">📍 ¿Cómo reclamar tu prenda?</h4>
            <ul style="color: #2e7d32; margin: 0; padding-left: 20px;">
              <li>Dirígete a nuestra oficina de objetos perdidos</li>
              <li>Presenta tu identificación</li>
              <li>Menciona el código de referencia: #${garmentDetails.id}</li>
            </ul>
          </div>
        </div>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 0 0 10px 10px; text-align: center;">
          <p style="color: #666; font-size: 14px; margin: 0;">
            Este es un mensaje automático. Si tienes dudas, contacta a nuestro equipo de objetos perdidos.
          </p>
        </div>
      </div>
    `,
    shouldSendEmail: true
  },

  "Devuelta al propietario": {
    subject: "Confirmación de devolución exitosa ✅",
    template: (garmentDetails) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2e7d32, #4caf50); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">¡Devolución completada! ✅</h1>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            ¡Perfecto! Tu prenda ha sido devuelta exitosamente. Esperamos que hayas recuperado tu artículo en perfecto estado.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2e7d32;">
            <h3 style="color: #2e7d32; margin-top: 0;">📋 Resumen de la devolución:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Prenda:</td><td style="padding: 5px 0;">${garmentDetails.tipo_prenda}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Código de referencia:</td><td style="padding: 5px 0;">#${garmentDetails.id}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Fecha de devolución:</td><td style="padding: 5px 0;">${new Date().toLocaleDateString('es-ES')}</td></tr>
            </table>
          </div>

          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #1976d2; margin: 0; text-align: center;">
              <strong>¡Gracias por confiar en nuestro servicio de objetos perdidos!</strong><br>
              Tu experiencia nos ayuda a mejorar cada día.
            </p>
          </div>
        </div>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 0 0 10px 10px; text-align: center;">
          <p style="color: #666; font-size: 14px; margin: 0;">
            Caso cerrado exitosamente. Si necesitas ayuda en el futuro, no dudes en contactarnos.
          </p>
        </div>
      </div>
    `,
    shouldSendEmail: true
  },

  "No reclamada - En bodega": {
    subject: "Recordatorio: Tu prenda sigue disponible 📦",
    template: (garmentDetails) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f57c00, #ff9800); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Recordatorio importante 📦</h1>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Tu prenda ha sido trasladada a nuestra bodega de almacenamiento por no haber sido reclamada en el tiempo establecido. 
            <strong>¡Aún puedes recuperarla!</strong>
          </p>
          
          <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f57c00;">
            <h3 style="color: #f57c00; margin-top: 0;">📋 Estado actual:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Prenda:</td><td style="padding: 5px 0;">${garmentDetails.tipo_prenda}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Ubicación:</td><td style="padding: 5px 0;">Bodega de almacenamiento</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Código:</td><td style="padding: 5px 0;">#${garmentDetails.id}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Fecha de traslado:</td><td style="padding: 5px 0;">${new Date().toLocaleDateString('es-ES')}</td></tr>
            </table>
          </div>

          <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #d32f2f; margin-top: 0;">⏰ Tiempo límite de reclamación</h4>
            <p style="color: #d32f2f; margin: 0;">
              Recuerda que tienes <strong>30 días adicionales</strong> para reclamar tu prenda antes de que sea donada o desechada.
              Contacta a nuestro equipo para coordinar la recogida.
            </p>
          </div>
        </div>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 0 0 10px 10px; text-align: center;">
          <p style="color: #666; font-size: 14px; margin: 0;">
            No dejes pasar más tiempo. Contacta con objetos perdidos para recuperar tu prenda.
          </p>
        </div>
      </div>
    `,
    shouldSendEmail: true
  },

  "Donada": {
    subject: "Notificación: Tu prenda ha sido donada 💝",
    template: (garmentDetails) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #7b1fa2, #9c27b0); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Tu prenda ha ayudado a otros 💝</h1>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Después del período establecido sin ser reclamada, tu prenda ha sido donada a organizaciones benéficas locales 
            donde podrá ayudar a personas que la necesiten.
          </p>
          
          <div style="background: #fce4ec; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7b1fa2;">
            <h3 style="color: #7b1fa2; margin-top: 0;">📋 Detalles de la donación:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Prenda donada:</td><td style="padding: 5px 0;">${garmentDetails.tipo_prenda}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Código de referencia:</td><td style="padding: 5px 0;">#${garmentDetails.id}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Fecha de donación:</td><td style="padding: 5px 0;">${new Date().toLocaleDateString('es-ES')}</td></tr>
            </table>
          </div>

          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="color: #2e7d32; margin: 0;">
              <strong>¡Gracias por contribuir indirectamente a una buena causa!</strong><br>
              Aunque no pudiste recuperar tu prenda, esta tendrá una segunda oportunidad de ser útil.
            </p>
          </div>
        </div>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 0 0 10px 10px; text-align: center;">
          <p style="color: #666; font-size: 14px; margin: 0;">
            Caso cerrado. Tu prenda está ahora en buenas manos ayudando a quienes más lo necesitan.
          </p>
        </div>
      </div>
    `,
    shouldSendEmail: true
  },

  "Desechada": {
    subject: "Notificación final: Estado de tu prenda 🗑️",
    template: (garmentDetails) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #616161, #757575); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Notificación final 📄</h1>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Lamentamos informarte que tu prenda ha sido desechada debido a su estado o por haber superado 
            todos los plazos establecidos sin ser reclamada.
          </p>
          
          <div style="background: #fafafa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #616161;">
            <h3 style="color: #616161; margin-top: 0;">📋 Información final:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Prenda:</td><td style="padding: 5px 0;">${garmentDetails.tipo_prenda}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Código:</td><td style="padding: 5px 0;">#${garmentDetails.id}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Fecha de procesamiento:</td><td style="padding: 5px 0;">${new Date().toLocaleDateString('es-ES')}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Motivo:</td><td style="padding: 5px 0;">Plazo vencido / Estado inadecuado</td></tr>
            </table>
          </div>

          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #1976d2; margin-top: 0;">💡 Para el futuro</h4>
            <p style="color: #1976d2; margin: 0;">
              Recuerda revisar tu correo regularmente y reclamar tus prendas dentro de los plazos establecidos 
              para evitar que esto vuelva a suceder.
            </p>
          </div>
        </div>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 0 0 10px 10px; text-align: center;">
          <p style="color: #666; font-size: 14px; margin: 0;">
            Este caso ha sido cerrado definitivamente. Gracias por utilizar nuestros servicios.
          </p>
        </div>
      </div>
    `,
    shouldSendEmail: false // No enviar email automáticamente para este estado
  }
};

// Función principal para enviar emails dinámicos - MEJORADA CON LOGGING DETALLADO
export const sendStatusUpdateEmail = async (userEmail, garmentDetails, newStatus) => {
  console.log("🔍 ========== INICIO sendStatusUpdateEmail ==========");
  console.log(`📧 Email destino: ${userEmail}`);
  console.log(`📊 Estado solicitado: "${newStatus}"`);
  console.log(`📦 Detalles prenda:`, garmentDetails);
  
  // Validar entrada
  if (!userEmail || !newStatus) {
    console.log("❌ Parámetros faltantes:");
    console.log(`   - Email: ${userEmail}`);
    console.log(`   - Estado: ${newStatus}`);
    return { sent: false, reason: 'Email o estado faltante' };
  }

  // Buscar plantilla exacta
  const template = emailTemplates[newStatus];
  console.log(`🔍 Plantilla encontrada para "${newStatus}":`, !!template);
  
  // Mostrar todos los estados disponibles para debug
  console.log("📋 Estados disponibles en plantillas:");
  Object.keys(emailTemplates).forEach(key => {
    console.log(`   - "${key}" (envía: ${emailTemplates[key].shouldSendEmail})`);
  });
  
  if (!template) {
    console.log(`❌ NO se encontró plantilla para estado: "${newStatus}"`);
    console.log("💡 Estados disponibles:", Object.keys(emailTemplates));
    return { sent: false, reason: `No template found for status: ${newStatus}` };
  }

  if (!template.shouldSendEmail) {
    console.log(`⚠️ Email deshabilitado para estado: "${newStatus}"`);
    return { sent: false, reason: 'Email disabled for this status' };
  }

  console.log(`✅ Plantilla válida encontrada. Preparando envío...`);
  console.log(`📧 Asunto: ${template.subject}`);

  // Verificar configuración de transporter
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("❌ Variables de entorno EMAIL_USER o EMAIL_PASS no configuradas");
    return { sent: false, reason: 'Email credentials not configured' };
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: template.subject,
    html: template.template(garmentDetails)
  };

  console.log(`📮 Configuración del email:`);
  console.log(`   - De: ${mailOptions.from}`);
  console.log(`   - Para: ${mailOptions.to}`);
  console.log(`   - Asunto: ${mailOptions.subject}`);

  try {
    console.log("🚀 Enviando email...");
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email enviado exitosamente para estado "${newStatus}"`);
    console.log(`📬 Message ID: ${info.messageId}`);
    console.log("🔍 ========== FIN sendStatusUpdateEmail (ÉXITO) ==========");
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Error enviando email para estado "${newStatus}":`, error);
    console.error("🔍 Detalles del error:", {
      message: error.message,
      code: error.code,
      command: error.command
    });
    console.log("🔍 ========== FIN sendStatusUpdateEmail (ERROR) ==========");
    return { sent: false, error: error.message };
  }
};

// Función backward compatible (mantiene la función original)
export const sendGarmentFoundEmail = async (userEmail, garmentDetails) => {
  console.log("📞 Llamada a sendGarmentFoundEmail (función legacy)");
  return await sendStatusUpdateEmail(userEmail, garmentDetails, "Encontrada - Pendiente de devolución");
};

// Función para configurar nuevas plantillas dinámicamente
export const addEmailTemplate = (status, template) => {
  emailTemplates[status] = template;
  console.log(`📧 Nueva plantilla agregada para estado: ${status}`);
};

// Función para obtener todos los estados disponibles
export const getAvailableStatuses = () => {
  return Object.keys(emailTemplates);
};

// Función para testing - verificar configuración
export const testEmailConfiguration = async () => {
  console.log("🔧 Verificando configuración de email...");
  
  try {
    // Verificar que tenemos las credenciales
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return { 
        configured: false, 
        error: "Variables EMAIL_USER o EMAIL_PASS no configuradas" 
      };
    }

    // Intentar verificar la conexión
    await transporter.verify();
    
    return { 
      configured: true, 
      user: process.env.EMAIL_USER,
      templates: Object.keys(emailTemplates).length
    };
  } catch (error) {
    return { 
      configured: false, 
      error: error.message 
    };
  }
};