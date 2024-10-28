import { FastifyRequest, FastifyReply } from 'fastify';
import { userModel } from '../models/userModel';
import { comparePassword, hashPassword } from '../utils/hashUtils';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../utils/email';

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

export const registerUser = async (req: FastifyRequest<{ Body: RegisterRequestBody }>, res: FastifyReply) => {
  const { name, email, password, birthdate, gender, ethnicity, graduation_year, course_id } = req.body;
  
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

export const loginUser = async (req: FastifyRequest<{ Body: LoginRequestBody }>, res: FastifyReply) => {
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

export const requestPasswordReset = async (req: FastifyRequest, res: FastifyReply) => {
  const { email } = req.body as { email: string };

  try {
    const user = await userModel.findByEmail(email);
    // Não informa se o e-mail não existe, pra não expor informações
    if (!user) return res.status(200).send({ message: 'Token de recuperação gerado e e-mail enviado, se o usuário existir.' });

    const token = crypto.randomBytes(32).toString('hex');

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // Expira em 1 hora

    await userModel.savePasswordResetToken(user.id, token, expiresAt);
    
    await sendPasswordResetEmail(email, token);

    return res.status(200).send({ message: 'Token de recuperação gerado e e-mail enviado, se o usuário existir.' });
  } catch (error) {
    req.log.error(error);
    return res.status(500).send({ message: 'Erro ao solicitar a recuperação de senha.' });
  }
};

interface ResetPasswordBody {
  token: string;
  newPassword: string;
}

export const resetPassword = async (req: FastifyRequest<{ Body: ResetPasswordBody }>, res: FastifyReply) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).send({ message: 'Token e nova senha são obrigatórios.' });
  }

  try {
    const resetToken = await userModel.findValidPasswordResetToken(token);
    if (!resetToken) {
      return res.status(400).send({ message: 'Token inválido ou expirado.' });
    }

    const hashedPassword = await hashPassword(newPassword);
    await userModel.updateUserPassword(resetToken.user_id, hashedPassword);

    await userModel.markTokenAsUsed(resetToken.id);

    return res.status(200).send({ message: 'Senha redefinida com sucesso.' });
  } catch (error) {
    req.log.error(error);
    return res.status(500).send({ message: 'Erro ao redefinir a senha.' });
  }
};