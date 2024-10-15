import { db } from '../utils/db';
import bcrypt from 'bcrypt';


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
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const [result] = await db.execute(
      `INSERT INTO \`user\` (name, email, password, birthdate, gender, ethnicity, graduation_year, is_admin) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.name,
        user.email,
        hashedPassword,
        user.birthdate,
        user.gender,
        user.ethnicity,
        user.graduation_year,
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
  }
};
