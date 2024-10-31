import { FastifyInstance } from 'fastify';
import { listCourses } from '../controllers/courseController';
import { getDashboardSummary } from '../controllers/courseController';

export default async function courseRoutes(app: FastifyInstance) {
  app.get('/', listCourses);
  app.get('/:courseId/dashboard-summary', { preValidation: [app.authenticate] }, getDashboardSummary);
}
