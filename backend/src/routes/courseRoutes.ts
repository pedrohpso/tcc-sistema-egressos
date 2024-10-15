import { FastifyInstance } from 'fastify';
import { listCourses } from '../controllers/courseController';

export default async function courseRoutes(app: FastifyInstance) {
  app.get('/', listCourses);
}
