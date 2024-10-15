import { FastifyRequest, FastifyReply } from 'fastify';
import { userModel } from '../models/userModel';
import { hashPassword } from '../utils/hashUtils';

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
