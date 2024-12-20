/// <reference path="../../vite-env.d.ts" />

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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

export const registerUser = async (userData: any) => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao registrar o usuário: ${error}`);
  }
};

export const registerAdmin = async (userData: any) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(`${API_URL}/users/admin-register`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao registrar o administrador: ${error}`);
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      email,
      password,
    });
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    return user;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};

export const getUserData = async () => {
  const token = localStorage.getItem('token');

  try {
    const response = await axios.get(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const userData = response.data

    userData.birthdate = userData.birthdate ? new Date(userData.birthdate).toLocaleDateString() : ''
    userData.gender = genderTranslations[userData.gender]
    userData.ethnicity = ethnicityTranslations[userData.ethnicity]

    return userData;
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    throw error;
  }
}

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/users/request-password-reset`, {
      email,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao solicitar a redefinição de senha:', error);
    throw error;
  }
}

export const passwordReset = async (token: string, newPassword: string) => {
  try {
    const response = await axios.post(`${API_URL}/users/reset-password`, {
      token,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao redefinir a senha:', error);
    throw error;
  }
}

export const updatePassword = async (currentPassword: string, newPassword: string) => {
  const token = localStorage.getItem('token');

  try {
    const response = await axios.put(`${API_URL}/users/update-password`, {
      currentPassword,
      newPassword,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar a senha:', error);
    throw error;
  }
}