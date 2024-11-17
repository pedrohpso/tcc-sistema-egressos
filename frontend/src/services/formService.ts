import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export enum FieldType {
  TEXT = 'text',
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  DATE = 'date'
}

export interface iOption {
  id: number;
  text: string;
}

export interface iEditableOption {
  id?: number;
  text: string;
}

export interface iDependency { 
  fieldId: number;
  optionIds: number[];
}

export interface iField {
  id: number;
  type: FieldType;
  question: string;
  options?: iOption[]; 
  position: number;
  dependencies?: iDependency[];
  indicator?: string;
}

export interface iForm {
  id: number;
  title: string;
  status: 'draft' | 'published';
  fields: iField[];
}

export type CreateFormFieldInput = {
  question: string;
  type: FieldType;
  options?: { text: string }[];
  position: number;
  indicator?: string;
  dependencies?: { fieldId: number; optionIds: number[] }[];
}

export type UpdateFieldInput = {
  question?: string;
  type?: FieldType;
  indicator?: string;
  dependencies?: { fieldId: number; optionIds: number[] }[];
  options?: { id?: number; text: string }[];
}

export const getFormsByCourse = async (courseId: number) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/forms/course/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar formulários:', error);
    throw error;
  }
};

export const getPublishedFormsByCourse = async (courseId: number) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/forms/course/${courseId}/published`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar formulários publicados:', error);
    throw error;
  }
}

export const getIndicatorsByForm = async (formId: number) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/forms/${formId}/indicators`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar os indicadores:', error);
    throw error;
  }
}

export const getGroupedDataByIndicator = async (params: { courseId: number, year: string, indicatorId: number, grouping: string }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/forms/data`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar os dados agrupados:', error);
    throw error;
  }
}

export const createForm = async (title: string, courseId: number) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/forms`,
      { title, course_id: courseId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao criar formulário:', error);
    throw error;
  }
};

export const deleteForm = async (formId: number) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/forms/${formId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Erro ao excluir o formulário:', error);
    throw error;
  }
};

export const renameForm = async (formId: number, title: string) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/forms/${formId}`,
      { title },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao renomear o formulário:', error);
    throw error;
  }
}

export const getFormById = async (formId: number): Promise<iForm> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/forms/${formId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar o formulário:', error);
    throw error;
  }
};

export const createFormField = async (formId: number, fieldData: CreateFormFieldInput): Promise<iField> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/forms/${formId}/fields`, fieldData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data;
  } catch (error) {
    console.error('Erro ao criar a questão:', error);
    throw error;
  }
};

export const editField = async (formId: number, fieldId: number, updates: UpdateFieldInput): Promise<iField> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/forms/${formId}/fields/${fieldId}`, updates, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao editar o campo:', error);
    throw error;
  }
};

export const deleteField = async (formId: number, fieldId: number) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/forms/${formId}/fields/${fieldId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Erro ao excluir o campo:', error);
    throw error;
  }
}

export const updateFormFieldOrder = (formId: number, fields: { fieldId: number, position: number }[]) => {
  try {
    const token = localStorage.getItem('token');
    return axios.post(`${API_URL}/forms/${formId}/order`, { fields }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Erro ao atualizar a ordem dos campos:', error);
    throw error;
  }
}

export const publishForm = async (formId: number) => {
  try {
    const token = localStorage.getItem('token');
    await axios.post(`${API_URL}/forms/${formId}/publish`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Erro ao publicar o formulário:', error);
    throw error;
  }
}

export const getUserForms = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/forms`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar os formulários do usuário:', error);
    throw error;
  }
}

export const saveAnswers = async (formId: number, answers: Record<string, string | string[]>) => {
  try {
    const token = localStorage.getItem('token');
    await axios.post(`${API_URL}/forms/${formId}/answers`, answers, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Erro ao salvar as respostas:', error);
    throw error;
  }
}

export const getDashboardSummary = async (courseId: number) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/courses/${courseId}/dashboard-summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar o resumo do dashboard:', error);
    throw error;
  }
}

export const getFormAnswersByUser = async (formId: number, userId: number) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/forms/${formId}/answers/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar as respostas do usuário:', error);
    throw error;
  }
}

export const getUsersFromPublishedForm = async (formId: number) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/forms/${formId}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar os usuários:', error);
    throw error;
  }
}