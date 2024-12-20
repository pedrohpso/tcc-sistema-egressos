import { FastifyRequest, FastifyReply } from 'fastify';
import { formModel } from '../models/formModel';
import { fieldModel } from '../models/fieldModel';
import { ReqUserType } from '../models/userModel';

interface CreateFormBody {
  course_id: number;
  title: string;
}

interface UpdateFormBody {
  title: string;
}

export const getFormsByCourse = async (req: FastifyRequest, res: FastifyReply) => {
  const courseId = (req.params as { courseId: string }).courseId as string;
  const user = req.user as ReqUserType;

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
  const user = req.user as ReqUserType;

  if (!user?.is_admin) {
    return res.status(403).send({ message: 'Acesso negado.' });
  }

  try {

    if(title.trim() === ''){
      return res.status(400).send({ message: 'O título do formulário é obrigatório.' });
    }

    const user = req.user as ReqUserType

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
  const user = req.user as ReqUserType

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
  const user = req.user as ReqUserType;

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
  const user = req.user as ReqUserType;

  if (!user) {
    return res.status(401).send({ message: 'Usuário não autorizado' });
  }

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
  const user = req.user as ReqUserType;

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

export const getUserForms = async (req: FastifyRequest, res: FastifyReply) => {
  const user = req.user as ReqUserType;

  if (!user) {
    return res.status(401).send({ message: 'Usuário não autorizado' });
  }

  try {
    const forms = await formModel.getFormsByUserId(user.id);
    return res.send(forms);
  } catch (error) {
    req.log.error(error);
    return res.status(500).send({ message: 'Erro ao buscar formulários' });
  }
}

export const getPublishedFormsByCourse = async (req: FastifyRequest, res: FastifyReply) => {
  const { courseId } = req.params as { courseId: string };
  const user = req.user as ReqUserType;

  if (!user?.is_admin) {
    return res.status(403).send({ message: 'Acesso negado.' });
  }

  try {
    const forms = await formModel.getPublishedFormsByCourse(Number(courseId));

    if (forms.length === 0) {
      return res.status(404).send({ message: 'Nenhum formulário publicado encontrado para este curso.' });
    }

    return res.status(200).send(forms);
  } catch (error) {
    req.log.error(error);
    return res.status(500).send({ message: 'Erro ao buscar os formulários publicados.' });
  }
};

const genderTranslations: { [key: string]: string } = {
  male: 'Homem Cis',
  female: 'Mulher Cis',
  trans_male: 'Homem Trans',
  trans_female: 'Mulher Trans',
  non_binary: 'Não-binário',
  other: 'Outro'
};

const ethnicityTranslations: { [key: string]: string } = {
  white: 'Branca',
  black: 'Preta',
  brown: 'Parda',
  yellow: 'Amarela',
  indigenous: 'Indígena',
  not_declared: 'Desejo não declarar'
};

export const getIndicatorData = async (req: FastifyRequest, res: FastifyReply) => {
  const { courseId, year, indicatorId, grouping } = req.query as {
    courseId: number;
    year: string;
    indicatorId: number;
    grouping: string;
  };
  const user = req.user as ReqUserType;

  if (!user?.is_admin) {
    return res.status(403).send({ message: 'Acesso negado.' });
  }

  const [startYear, endYear] = year.split('-').map(Number);

  try {
    const rawData = await formModel.getGroupedDataByIndicator({courseId, indicatorId, startYear, endYear, grouping});
    const formattedData = rawData.reduce((acc: any[], row: any) => {
      let groupName = row.group_label;

      if (grouping === 'gender') {
        groupName = genderTranslations[groupName] || groupName;
      } else if (grouping === 'ethnicity') {
        groupName = ethnicityTranslations[groupName] || groupName;
      }

      let group = acc.find((g) => g.name === groupName);

      if (!group) {
        group = { name: groupName };
        acc.push(group);
      }

      group[row.option_text] = row.response_count;
      return acc;
    }, []);
    return res.send(formattedData);
  } catch (error) {
    req.log.error(error);
    return res.status(500).send({ message: 'Erro ao obter dados agrupados.' });
  }
};

export const getFormAnswersByUser = async (req: FastifyRequest, res: FastifyReply) => {
  const { formId, userId } = req.params as { formId: string, userId: string };
  const user = req.user as ReqUserType;

  if (!user?.is_admin) {
    return res.status(403).send({ message: 'Acesso negado.' });
  }

  try {
    const answers = await formModel.getAnswersByUser(Number(formId), Number(userId));
    return res.send(answers);
  } catch (error) {
    req.log.error(error);
    return res.status(500).send({ message: 'Erro ao buscar respostas do usuário.' });
  }
};

export const getUsersFromPublishedForm = async (req: FastifyRequest, res: FastifyReply) => {
  const { formId } = req.params as { formId: string };
  const user = req.user as ReqUserType;

  if (!user?.is_admin) {
    return res.status(403).send({ message: 'Acesso negado.' });
  }

  try {
    const users = await formModel.getUsersByForm(Number(formId));
    return res.send(users);
  } catch (error) {
    req.log.error(error);
    return res.status(500).send({ message: 'Erro ao buscar usuários que responderam ao formulário.' });
  }
};