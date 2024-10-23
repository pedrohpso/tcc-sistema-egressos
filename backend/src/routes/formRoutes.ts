import { FastifyInstance } from "fastify";
import { getFormsByCourse, createForm, updateForm, deleteForm, getFormById } from "../controllers/formController";

export default async function formRoutes(app: FastifyInstance) {
  app.get('/course/:courseId', { preValidation: [app.authenticate] }, getFormsByCourse);
  app.post('/', { preValidation: [app.authenticate] }, createForm);
  app.put('/:id', { preValidation: [app.authenticate] }, updateForm);
  app.delete('/:id', { preValidation: [app.authenticate] }, deleteForm);
  app.get('/:id', { preValidation: [app.authenticate] }, getFormById);
}
