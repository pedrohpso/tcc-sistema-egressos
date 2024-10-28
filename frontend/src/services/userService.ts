/// <reference path="../../vite-env.d.ts" />

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const registerUser = async (userData: any) => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao registrar o usuário: ${error}`);
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

export const getUserData = async (token: string) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  try {
    const response = await axios.get(`${API_URL}/users/me`);
    return response.data;
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