import { FastifyRequest, FastifyReply } from 'fastify';
import { fieldModel } from '../models/fieldModel';

interface CreateFieldBody {
  question: string;
  type: 'text' | 'single_choice' | 'multiple_choice' | 'date';
  position: number;
  options?: { text: string }[];
  dependencies?: { fieldId: number; optionIds: number[] }[];
  indicator?: string;
}

export const createField = async (req: FastifyRequest, res: FastifyReply) => {
  const { formId } = req.params as { formId: string };
  const { question, type, position, options, dependencies, indicator } = req.body as CreateFieldBody;
  const user = req.user as { is_admin: boolean };

  if (!user?.is_admin) {
    return res.status(403).send({ message: 'Acesso negado.' });
  }

  if (!question || !type || position === undefined || ((type === 'single_choice' || type === 'multiple_choice') && !indicator && (!options || options.length === 0))) {
    return res.status(400).send({ message: 'Dados incompletos.' });
  }

  try {
    const newField = await fieldModel.createField({
      formId: Number(formId),
      question,
      type,
      position,
      options,
      dependencies,
      indicator
    });

    return res.status(201).send(newField);
  } catch (error) {
    req.log.error(error);
    return res.status(500).send({ message: 'Erro ao adicionar a questão.' });
  }
};
