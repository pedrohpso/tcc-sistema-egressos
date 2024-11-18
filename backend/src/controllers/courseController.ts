import { FastifyReply, FastifyRequest } from 'fastify';
import { courseModel } from '../models/courseModel';
import { ReqUserType } from '../models/userModel';

export const listCourses = async (_req: FastifyRequest, res: FastifyReply) => {
  try {
    const courses = await courseModel.getAllCourses();
    res.status(200).send(courses);
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    res.status(500).send({ error: 'Erro ao buscar cursos' });
  }
}


export const getDashboardSummary = async (req: FastifyRequest, res: FastifyReply) => {
  const { courseId } = req.params as { courseId: string };
  const user = req.user as ReqUserType;

  if (!user?.is_admin) {
    return res.status(403).send({ message: 'Acesso negado.' });
  }

  try {
    const summary = await courseModel.getDashboardSummary(Number(courseId));
    return res.status(200).send(summary);
  } catch (error) {
    req.log.error(error);
    return res.status(500).send({ message: 'Erro ao buscar o resumo do dashboard.' });
  }
};
