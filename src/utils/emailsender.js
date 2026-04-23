
import nodemailer from 'nodemailer';

// Configuración del transporter Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,       // tu-email@gmail.com
    pass: process.env.GMAIL_APP_PASSWORD // App Password de 16 caracteres
  }
});

// Verificar conexión al iniciar (opcional pero útil para debug)
transporter.verify((error) => {
  if (error) {
    console.error('❌ Error configurando Gmail:', error.message);
  } else {
    console.log('✅ Gmail listo para enviar emails');
  }
});

// Plantillas por estado
const emailTemplates = {
  "Encontrada - Pendiente de devolución": {
    subject: "¡Tu prenda ha sido encontrada! 🎉",
    shouldSendEmail: true,
    html: (g) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1976d2, #42a5f5); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">¡Excelente noticia! 🎉</h1>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0;">
          <p style="font-size: 16px; color: #333;">
            Hola <strong>${g.nombre}</strong>, hemos encontrado tu prenda y está disponible para ser reclamada.
          </p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #1976d2;">
            <h3 style="color: #1976d2; margin-top: 0;">📋 Detalles de tu prenda:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Tipo:</td><td>${g.tipo_prenda}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Talla:</td><td>${g.talla || 'N/A'}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Estado:</td><td>${g.estado}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Código:</td><td>#${g.id}</td></tr>
              ${g.observaciones ? `<tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Observaciones:</td><td>${g.observaciones}</td></tr>` : ''}
            </table>
          </div>
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <h4 style="color: #2e7d32; margin-top: 0;">📍 ¿Cómo reclamar tu prenda?</h4>
            <ul style="color: #2e7d32; margin: 0; padding-left: 20px;">
              <li>Dirígete a nuestra oficina de objetos perdidos</li>
              <li>Presenta tu identificación (RUT: ${g.rut})</li>
              <li>Menciona el código de referencia: <strong>#${g.id}</strong></li>
            </ul>
          </div>
        </div>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
          <p style="color: #666; font-size: 13px; margin: 0;">Mensaje automático — Sistema de Objetos Perdidos</p>
        </div>
      </div>
    `
  },

  "Devuelta al propietario": {
    subject: "Confirmación de devolución exitosa ✅",
    shouldSendEmail: true,
    html: (g) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2e7d32, #4caf50); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">¡Devolución completada! ✅</h1>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0;">
          <p style="font-size: 16px; color: #333;">
            Hola <strong>${g.nombre}</strong>, tu prenda ha sido devuelta exitosamente.
          </p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #2e7d32;">
            <h3 style="color: #2e7d32; margin-top: 0;">📋 Resumen:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Prenda:</td><td>${g.tipo_prenda}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Código:</td><td>#${g.id}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Fecha:</td><td>${new Date().toLocaleDateString('es-ES')}</td></tr>
            </table>
          </div>
        </div>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
          <p style="color: #666; font-size: 13px; margin: 0;">Mensaje automático — Sistema de Objetos Perdidos</p>
        </div>
      </div>
    `
  },

  "No reclamada - En bodega": {
    subject: "Recordatorio: Tu prenda sigue disponible 📦",
    shouldSendEmail: true,
    html: (g) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f57c00, #ff9800); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Recordatorio importante 📦</h1>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0;">
          <p style="font-size: 16px; color: #333;">
            Hola <strong>${g.nombre}</strong>, tu prenda está en bodega. <strong>¡Aún puedes recuperarla!</strong>
          </p>
          <div style="background: #fff3e0; padding: 20px; border-radius: 8px; border-left: 4px solid #f57c00;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Prenda:</td><td>${g.tipo_prenda}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold; color: #555;">Código:</td><td>#${g.id}</td></tr>
            </table>
          </div>
          <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="color: #d32f2f; margin: 0;">
              Tienes <strong>30 días</strong> para reclamar tu prenda antes de que sea donada o desechada.
            </p>
          </div>
        </div>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
          <p style="color: #666; font-size: 13px; margin: 0;">Mensaje automático — Sistema de Objetos Perdidos</p>
        </div>
      </div>
    `
  },

  "Donada": {
    subject: "Notificación: Tu prenda ha sido donada 💝",
    shouldSendEmail: true,
    html: (g) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #7b1fa2, #9c27b0); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Tu prenda ha ayudado a otros 💝</h1>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0;">
          <p style="font-size: 16px; color: #333;">
            Hola <strong>${g.nombre}</strong>, tu prenda <strong>${g.tipo_prenda}</strong> (#${g.id}) 
            fue donada a organizaciones benéficas locales al no ser reclamada en el plazo establecido.
          </p>
        </div>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
          <p style="color: #666; font-size: 13px; margin: 0;">Mensaje automático — Sistema de Objetos Perdidos</p>
        </div>
      </div>
    `
  },

  "Desechada": {
    subject: "Notificación final: Estado de tu prenda 🗑️",
    shouldSendEmail: false // no enviar email para este estado
  }
};

// Función principal
export const sendStatusUpdateEmail = async (userEmail, garmentDetails, newStatus) => {
  console.log(`📧 Intentando enviar email → ${userEmail} | estado: "${newStatus}"`);

  if (!userEmail || !newStatus) {
    return { sent: false, reason: 'Email o estado faltante' };
  }

  const template = emailTemplates[newStatus];

  if (!template) {
    console.log(`❌ Sin plantilla para estado: "${newStatus}"`);
    return { sent: false, reason: `Sin plantilla para: ${newStatus}` };
  }

  if (!template.shouldSendEmail) {
    console.log(`⚠️ Email deshabilitado para estado: "${newStatus}"`);
    return { sent: false, reason: 'Email deshabilitado para este estado' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Objetos Perdidos" <${process.env.GMAIL_USER}>`,
      to: userEmail,
      subject: template.subject,
      html: template.html(garmentDetails)
    });

    console.log(`✅ Email enviado correctamente. MessageId: ${info.messageId}`);
    return { sent: true, messageId: info.messageId };

  } catch (error) {
    console.error(`❌ Error enviando email:`, error.message);
    return { sent: false, error: error.message };
  }
};