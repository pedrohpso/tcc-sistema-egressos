import { RowDataPacket } from 'mysql2';
import { db } from '../utils/db';
import { hashPassword } from '../utils/hashUtils';


interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  birthdate?: string; // YYYY-MM-DD
  gender?: 'male' | 'female' | 'trans_male' | 'trans_female' | 'non_binary' | 'other';
  ethnicity?: 'white' | 'black' | 'brown' | 'yellow' | 'indigenous' | 'not_declared';
  graduation_year?: number;
  is_admin: boolean;
  created: Date;
  modified: Date;
  deleted: Date | null;
}

export const userModel = {
  async createUser(user: Omit<User, 'id' | 'created' | 'modified' | 'deleted'>): Promise<User> {
    const hashedPassword = await hashPassword(user.password);
    const [result] = await db.execute(
      `INSERT INTO \`user\` (name, email, password, birthdate, gender, ethnicity, graduation_year, is_admin) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.name,
        user.email,
        hashedPassword,
        user.birthdate ? user.birthdate : null,
        user.gender ? user.gender : null,
        user.ethnicity ? user.ethnicity : null,
        user.graduation_year? user.graduation_year : null,
        user.is_admin ? 1 : 0
      ]
    );
    const insertId = (result as any).insertId;
    const [rows] = await db.execute('SELECT * FROM `user` WHERE id = ?', [insertId]);
    return (rows as User[])[0];
  },

  async addUserToCourse(userId: number, courseId: number) {
    await db.execute(
      `INSERT INTO user_course (user_id, course_id) VALUES (?, ?)`,
      [userId, courseId]
    );
  },

  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await db.execute('SELECT * FROM `user` WHERE email = ?', [email]);
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  },

  async findById(id: number): Promise<User | null> {
    const [rows] = await db.execute('SELECT * FROM `user` WHERE id = ?', [id]);
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  },

  async findUserByEmail(email: string) {
    const [rows] = await db.execute<RowDataPacket[]>('SELECT * FROM user WHERE email = ?', [email]);
    return rows[0];
  },

  async savePasswordResetToken(userId: number, token: string, expiresAt: Date) {
    await db.execute(
      'INSERT INTO password_reset_token (user_id, token, expires_at) VALUES (?, ?, ?)',
      [userId, token, expiresAt]
    );
  },

  async findValidPasswordResetToken(token: string) {
    const [rows] = await db.execute(
      `SELECT * FROM password_reset_token 
       WHERE token = ? AND expires_at > NOW() AND used_at IS NULL`,
      [token]
    );
    const tokens = rows as any[];
    return tokens.length > 0 ? tokens[0] : null;
  },

  async updateUserPassword(userId: number, hashedPassword: string) {
    await db.execute(
      'UPDATE `user` SET password = ?, modified = NOW() WHERE id = ?',
      [hashedPassword, userId]
    );
  },

  async markTokenAsUsed(tokenId: number) {
    await db.execute(
      'UPDATE password_reset_token SET used_at = NOW() WHERE id = ?',
      [tokenId]
    );
  },

  async updatePassword(userId: number, newPassword: string) {
    await db.execute(
      'UPDATE user SET password = ?, modified = CURRENT_TIMESTAMP WHERE id = ?',
      [newPassword, userId]
    );
  },
};
