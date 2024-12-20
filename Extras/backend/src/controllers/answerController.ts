import { FastifyRequest, FastifyReply } from 'fastify';
import { fieldModel } from '../models/fieldModel';
import { answerModel } from '../models/answerModel';
import { ReqUserType } from '../models/userModel';

interface SaveAnswerBody {
  [fieldId: string]: string | string[]; 
}

export const saveAnswers = async (req: FastifyRequest, res: FastifyReply) => {
  const { formId } = req.params as { formId: string };
  const answers = req.body as SaveAnswerBody;
  const user = req.user as ReqUserType;

  if (!user) {
    return res.status(401).send({ message: 'Usuário não autorizado' });
  }

  try {
    const fields = await fieldModel.getFieldsByForm(Number(formId));

    const formAnswerId = await answerModel.createFormAnswer(user.id, Number(formId));

    for (const [fieldId, response] of Object.entries(answers)) {
      const parsedFieldId = Number(fieldId);
      const field = fields.find(f => f.id === parsedFieldId);

      if (!field) {
        return res.status(400).send({ message: `Campo com ID ${fieldId} não encontrado no formulário.` });
      }

      if (field.type === 'multiple_choice' && Array.isArray(response)) {
        for (const optionId of response) {
          await answerModel.createAnswer({
            fieldId: parsedFieldId,
            formAnswerId,
            fieldOptionId: Number(optionId),
            text: null
          });
        }
      } else if (field.type === 'single_choice' && !Array.isArray(response) && !isNaN(Number(response))) {
        await answerModel.createAnswer({
          fieldId: parsedFieldId,
          formAnswerId,
          fieldOptionId: Number(response),
          text: null
        });
      } else if ((field.type === 'text' || field.type === 'date') && typeof response === 'string') {
        await answerModel.createAnswer({
          fieldId: parsedFieldId,
          formAnswerId,
          fieldOptionId: null,
          text: response
        });
      } else {
        return res.status(400).send({ message: `Resposta inválida para o campo ${fieldId}.` });
      }
    }

    return res.status(201).send({ message: 'Respostas salvas com sucesso!' });
  } catch (error) {
    req.log.error(error);
    return res.status(500).send({ message: 'Erro ao salvar respostas.' });
  }
};
