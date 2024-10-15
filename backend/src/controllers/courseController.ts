import { FastifyReply, FastifyRequest } from 'fastify';
import { courseModel } from '../models/courseModel';

export async function listCourses(_request: FastifyRequest, reply: FastifyReply) {
  try {
    const courses = await courseModel.getAllCourses();
    reply.status(200).send(courses);
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    reply.status(500).send({ error: 'Erro ao buscar cursos' });
  }
}
