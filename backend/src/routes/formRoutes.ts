import { FastifyInstance } from "fastify";
import { getFormsByCourse, createForm, updateForm, deleteForm, getFormById, publishForm, getUserForms, getPublishedFormsByCourse, getIndicatorData } from "../controllers/formController";
import { createField, deleteField, getIndicatorsByForm, updateField, updateFieldOrder } from "../controllers/fieldController";
import { saveAnswers } from "../controllers/answerController";

export default async function formRoutes(app: FastifyInstance) {
  app.get('/course/:courseId', { preValidation: [app.authenticate] }, getFormsByCourse);
  app.get('/course/:courseId/published', { preValidation: [app.authenticate] }, getPublishedFormsByCourse);
  app.post('/:id/publish', { preValidation: [app.authenticate] }, publishForm);
  app.post('/', { preValidation: [app.authenticate] }, createForm);
  app.put('/:id', { preValidation: [app.authenticate] }, updateForm);
  app.delete('/:id', { preValidation: [app.authenticate] }, deleteForm);

  app.get('/:formId/indicators', { preValidation: [app.authenticate] }, getIndicatorsByForm);
  app.get('/data', { preValidation: [app.authenticate] }, getIndicatorData);

  app.post('/:formId/fields', { preValidation: [app.authenticate] }, createField);
  app.put('/:formId/fields/:fieldId', { preValidation: [app.authenticate] }, updateField);
  app.post('/:formId/order', { preValidation: [app.authenticate] }, updateFieldOrder);
  app.delete('/:formId/fields/:fieldId', { preValidation: [app.authenticate] }, deleteField);

  app.get('/', { preValidation: [app.authenticate] }, getUserForms);
  app.get('/:id', { preValidation: [app.authenticate] }, getFormById);
  app.post('/:formId/answers', { preValidation: [app.authenticate] }, saveAnswers);
}
