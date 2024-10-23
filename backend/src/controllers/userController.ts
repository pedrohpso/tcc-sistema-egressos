import { FastifyRequest, FastifyReply } from 'fastify';
import { userModel } from '../models/userModel';
import { comparePassword } from '../utils/hashUtils';

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  birthdate?: string; // YYYY-MM-DD
  gender?: 'male' | 'female' | 'trans_male' | 'trans_female' | 'non_binary' | 'other';
  ethnicity?: 'white' | 'black' | 'brown' | 'yellow' | 'indigenous' | 'not_declared';
  graduation_year?: number;
  course_id?: number;
}

export const registerController = async (req: FastifyRequest<{ Body: RegisterRequestBody }>, res: FastifyReply) => {
  const { name, email, password, birthdate, gender, ethnicity, graduation_year, course_id } = req.body;

  console.log({ name, email, password, birthdate, gender, ethnicity, graduation_year });
  
  if (!name || !email || !password) {
    return res.status(400).send({ error: 'Campos obrigatórios faltando' });
  }

  try {
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).send({ message: 'Usuário já registrado com este email.' });
    }

    const newUser = await userModel.createUser({
      name,
      email,
      password,
      birthdate,
      gender,
      ethnicity,
      graduation_year,
      is_admin: false
    });

    if (course_id) {
      await userModel.addUserToCourse(newUser.id, course_id);
    }

    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).send(userWithoutPassword);
  } catch (error) {
    req.log.error(error);
    return res.status(500).send({ message: 'Erro interno do servidor.' });
  }
};

interface LoginRequestBody {
  email: string;
  password: string;
}

export const loginController = async (req: FastifyRequest<{ Body: LoginRequestBody }>, res: FastifyReply) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ error: 'Email e senha são obrigatórios' });
  }

  try {
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).send({ error: 'Email não registrado' });
    }

    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).send({ error: 'Senha inválida' });
    }

    const token = await res.jwtSign({ id: user.id, is_admin: user.is_admin });

    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).send({ token, user: userWithoutPassword });
  } catch (error) {
    req.log.error(error);
    return res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

export const getUserProfile = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const userId = (req.user as {id: number}).id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'Usuário não encontrado.' });
    }

    const { password, ...userWithoutPassword } = user;
    return res.send(userWithoutPassword);
  } catch (error) {
    req.log.error(error);
    return res.status(500).send({ message: 'Erro ao buscar o perfil do usuário.' });
  }
};