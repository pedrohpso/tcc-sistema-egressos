import { FastifyInstance } from 'fastify';
import { getUserProfile, loginUser, registerUser, requestPasswordReset, resetPassword } from '../controllers/userController';

export default async function userRoutes(app: FastifyInstance) {
  app.post('/register', registerUser);
  app.post('/login', loginUser);
  app.get('/me', { preValidation: [app.authenticate] }, getUserProfile);
  app.post('/request-password-reset', requestPasswordReset);
  app.post('/reset-password', resetPassword);
}
