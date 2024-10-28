import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', 
  port: 465, 
  secure: true, 
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS  
  }
});

export const sendPasswordResetEmail = async (email: string, token: string) => {

  const resetLink = `http://localhost:5173/reset-password?token=${token}`;
  const mailOptions = {
    from: `Sistema de Egressos <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Recuperação de Senha - Sistema de Egressos',
    text: `Olá, você solicitou a recuperação de senha. Use o link abaixo para redefinir sua senha:\n\n${resetLink}\n\nEste link expira em 1 hora.`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`E-mail de recuperação de senha enviado para ${email}`);
  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error);
    throw new Error('Erro ao enviar o e-mail.');
  }
};
