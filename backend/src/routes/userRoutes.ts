import { FastifyInstance } from 'fastify';
import { getUserProfile, loginController, registerController } from '../controllers/userController';

export default async function userRoutes(app: FastifyInstance) {
  app.post('/register', registerController);
  app.post('/login', loginController);
  app.get('/me', { preValidation: [app.authenticate] }, getUserProfile);
}
