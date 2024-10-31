import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateFieldInput, fieldModel, UpdateFieldInput } from '../models/fieldModel';

const defaultUpdateFields = {
  question: null,
  type: null,
  indicator: null,
  dependencies: null,
  options: null,
};

function normalizeData<T>(data: Partial<T>, defaultFields: Partial<T>) {
  return { ...defaultFields, ...data };
}

export const createField = async (req: FastifyRequest, res: FastifyReply) => {
  const { formId } = req.params as { formId: string };
  const { question, type, position, options, dependencies, indicator } = req.body as CreateFieldInput;
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

export const updateField = async (req: FastifyRequest, res: FastifyReply) => {
  const { fieldId } = req.params as { fieldId: string };
  const updates = req.body as UpdateFieldInput
  const normalizedUpdates  = normalizeData(updates, defaultUpdateFields);
  const user = req.user as { is_admin: boolean };

  if (!user?.is_admin) {
    return res.status(403).send({ message: 'Acesso negado.' });
  }

  try {
    const updatedField = await fieldModel.updateField(Number(fieldId), normalizedUpdates);
    res.send(updatedField);
  } catch (error) {
    req.log.error(error);
    res.status(500).send({ message: 'Erro ao atualizar o campo.' });
  }
};

export const deleteField = async (req: FastifyRequest, res: FastifyReply) => {
  const { fieldId } = req.params as { fieldId: string };
  const user = req.user as { is_admin: boolean };

  if (!user?.is_admin) {
    return res.status(403).send({ message: 'Acesso negado.' });
  }

  try {
    await fieldModel.deleteField(Number(fieldId));
    res.send({ message: 'Campo deletado com sucesso.' });
  } catch (error) {
    req.log.error(error);
    res.status(500).send({ message: 'Erro ao deletar o campo.' });
  }
}

export const updateFieldOrder = async (req: FastifyRequest, res: FastifyReply) => {
  const { formId } = req.params as { formId: string };
  const { fields } = req.body as { fields: { fieldId: number, position: number }[] };
  const user = req.user as { is_admin: boolean };

  if (!user?.is_admin) {
    return res.status(403).send({ message: 'Acesso negado.' });
  }

  try {
    await fieldModel.updateFieldOrder(Number(formId), fields);
    res.send({ message: 'Ordem atualizada com sucesso.' });
  } catch (error) {
    req.log.error(error);
    res.status(500).send({ message: 'Erro ao atualizar a ordem dos campos.' });
  }
}

export const getIndicatorsByForm = async (req: FastifyRequest, res: FastifyReply) => {
  const { formId } = req.params as { formId: string };
  const user = req.user as { is_admin: boolean };

  if (!user?.is_admin) {
    return res.status(403).send({ message: 'Acesso negado.' });
  }

  try {
    const indicators = await fieldModel.getIndicatorsByForm(Number(formId));
    if (!indicators.length) {
      return res.status(404).send({ message: 'Nenhum indicador encontrado para este formulário.' });
    }
    return res.status(200).send(indicators);
  } catch (error) {
    req.log.error(error);
    return res.status(500).send({ message: 'Erro ao buscar indicadores.' });
  }
};