// emailsender.js - Versión corregida con sintaxis ES modules
import nodemailer from 'nodemailer';

// Configuración del transporter (ejemplo con Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Función para enviar notificación de prenda encontrada
export const sendGarmentFoundEmail = async (userEmail, garmentDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: '¡Tu prenda ha sido encontrada! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">¡Buena noticia!</h2>
        <p>Hemos encontrado tu prenda en nuestro sistema de objetos perdidos.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Detalles de la prenda:</h3>
          <p><strong>Tipo:</strong> ${garmentDetails.tipo_prenda}</p>
          <p><strong>Talla:</strong> ${garmentDetails.talla}</p>
          <p><strong>Estado:</strong> ${garmentDetails.estado}</p>
          <p><strong>Fecha de registro:</strong> ${new Date(garmentDetails.fecha_registro).toLocaleDateString()}</p>
          ${garmentDetails.observaciones ? `<p><strong>Observaciones:</strong> ${garmentDetails.observaciones}</p>` : ''}
        </div>

        <p>Por favor, acércate a nuestra oficina de objetos perdidos para reclamar tu prenda.</p>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          Este es un mensaje automático, por favor no respondas a este correo.
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado: ', info.messageId);
    return true;
  } catch (error) {
    console.error('Error enviando email: ', error);
    return false;
  }
};