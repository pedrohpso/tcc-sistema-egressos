import { FastifyInstance } from "fastify";
import { getFormsByCourse, createForm, updateForm, deleteForm, getFormById } from "../controllers/formController";
import { createField, deleteField, updateField, updateFieldOrder } from "../controllers/fieldController";

export default async function formRoutes(app: FastifyInstance) {
  app.get('/course/:courseId', { preValidation: [app.authenticate] }, getFormsByCourse);
  app.post('/', { preValidation: [app.authenticate] }, createForm);
  app.put('/:id', { preValidation: [app.authenticate] }, updateForm);
  app.delete('/:id', { preValidation: [app.authenticate] }, deleteForm);
  app.get('/:id', { preValidation: [app.authenticate] }, getFormById);

  app.post('/:formId/fields', { preValidation: [app.authenticate] }, createField);
  app.put('/:formId/fields/:fieldId', { preValidation: [app.authenticate] }, updateField);
  app.post('/:formId/order', { preValidation: [app.authenticate] }, updateFieldOrder);
  app.delete('/:formId/fields/:fieldId', { preValidation: [app.authenticate] }, deleteField);
}
