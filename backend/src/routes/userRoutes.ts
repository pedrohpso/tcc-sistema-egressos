import { FastifyInstance } from 'fastify';
import { registerController } from '../controllers/userController';

export default async function userRoutes(app: FastifyInstance) {
  app.post('/register', registerController);
}
