import { FastifyRequest, FastifyReply } from 'fastify';
import { formModel } from '../models/formModel';
import { fieldModel } from '../models/fieldModel';

interface CreateFormBody {
  course_id: number;
  title: string;
}

interface UpdateFormBody {
  title: string;
}

export const getFormsByCourse = async (req: FastifyRequest, res: FastifyReply) => {
  const courseId = (req.params as { courseId: string }).courseId as string;
  const user = req.user as { is_admin: boolean };

  if (!user?.is_admin) {
    return res.status(403).send({ message: 'Acesso negado.' });
  }

  if (!courseId) {
    return res.status(400).send({ message: 'O ID do curso é necessário.' });
  }

  try {
    const forms = await formModel.getFormsByCourseId(Number(courseId));
    return res.send(forms);
  } catch (error) {
    req.log.error(error);
    return res.status(500).send({ message: 'Erro ao buscar formulários.' });
  }
};

export const createForm = async (req: FastifyRequest, res: FastifyReply) => {
  const { title, course_id } = req.body as CreateFormBody
  const user = req.user as { is_admin: boolean };

  if (!user?.is_admin) {
    return res.status(403).send({ message: 'Acesso negado.' });
  }

  try {

    if(title.trim() === ''){
      return res.status(400).send({ message: 'O título do formulário é obrigatório.' });
    }

    const user = req.user as { id: number, is_admin: boolean };

    if (!user || !user.is_admin) {
      return res.status(401).send({ message: 'Usuário não autorizado.' });
    }

    const newForm = await formModel.createForm({title, user_id: user.id, course_id, status: 'draft'});
    return res.status(201).send(newForm);
  } catch (error) {
    req.log.error(error);
    return res.status(500).send({ message: 'Erro ao criar o formulário.' });
  }
};

export const updateForm = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  const formId = parseInt((req.params as {id: string}).id, 10);
  const { title } = req.body as UpdateFormBody;
  const user = req.user as {id: number, is_admin: boolean}

  if (isNaN(formId) || !title || !user) {
    return res.status(400).send({ message: 'Dados inválidos' });
  }

  if (!user.is_admin) {
    return res.status(403).send({ message: 'Acesso negado' });
  }

  try {
    const form = await formModel.getFormById(formId);
    if (!form) {
      return res.status(404).send({ message: 'Formulário não encontrado' });
    }

    const updatedForm = await formModel.updateFormTitle(formId, title);
    if (!updatedForm) {
      return res.status(500).send({ message: 'Erro ao atualizar o título do formulário' });
    }

    return res.status(200).send(updatedForm);
  } catch (error) {
    req.log.error(error);
    return res.status(500).send({ message: 'Erro ao atualizar o formulário' });
  }
};

export const deleteForm = async (req: FastifyRequest, res: FastifyReply) => {
  const { id } = req.params as { id: string };
  const user = req.user as { is_admin: boolean };

  if (!user?.is_admin) {
    return res.status(403).send({ message: 'Acesso negado.' });
  }

  const form = await formModel.getFormById(Number(id));
  if (!form) {
    return res.status(404).send({ message: 'Formulário não encontrado.' });
  }

  if (form.status === 'published') {
    return res.status(400).send({ message: 'Formulário publicado não pode ser excluído.' });
  }

  try {
    await formModel.deleteForm(Number(id));
    return res.status(200).send({ message: 'Formulário excluído com sucesso.' });
  } catch (error) {
    res.status(500).send({ message: 'Erro ao excluir o formulário.' });
  }
};

export const getFormById = async (req: FastifyRequest, res: FastifyReply) => {
  const formId = parseInt((req.params as {id: string}).id, 10);
  
  if (isNaN(formId)) {
    return res.status(400).send({ message: 'ID do formulário inválido' });
  }

  try {
    const form = await formModel.getFormById(formId);
    if (!form) {
      return res.status(404).send({ message: 'Formulário não encontrado' });
    }

    const fields = await fieldModel.getFieldsByForm(formId);
    form.fields = fields;

    return res.status(200).send(form);
  } catch (error) {
    req.log.error(error);
    return res.status(500).send({ message: 'Erro ao buscar o formulário' });
  }
};

export const publishForm = async (req: FastifyRequest, res: FastifyReply) => {
  const formId = parseInt((req.params as {id: string}).id, 10);
  const user = req.user as { is_admin: boolean };

  if (!user?.is_admin) {
    return res.status(403).send({ message: 'Acesso negado.' });
  }

  if (isNaN(formId)) {
    return res.status(400).send({ message: 'ID do formulário inválido' });
  }

  try {
    const form = await formModel.getFormById(formId);
    if (!form) {
      return res.status(404).send({ message: 'Formulário não encontrado' });
    }

    if (form.status === 'published') {
      return res.status(400).send({ message: 'Formulário já publicado' });
    }

    await formModel.publishForm(formId);
    return res.status(200).send({ message: 'Formulário publicado com sucesso' });
  } catch (error) {
    req.log.error(error);
    return res.status(500).send({ message: 'Erro ao publicar o formulário' });
  }
}
