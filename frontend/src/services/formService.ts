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