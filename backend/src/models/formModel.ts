import { iForm } from '../types/formTypes';
import { db } from '../utils/db';

interface Form {
  id: number;
  user_id: number;
  course_id: number;
  status: 'draft' | 'published';
  title: string;
  created: Date;
  modified: Date;
  deleted: Date | null;
}

export const formModel = {
  async getAllForms(): Promise<Form[]> {
    const [rows] = await db.execute('SELECT * FROM `form` WHERE `deleted` IS NULL');
    return rows as Form[];
  },

  async getFormsByCourseId(courseId: number) {
    const [rows] = await db.execute(
      'SELECT id, title, status FROM form WHERE course_id = ? AND deleted IS NULL',
      [courseId]
    );
    return rows;
  },

  async createForm(form: Omit<Form, 'id' | 'created' | 'modified' | 'deleted'>): Promise<Form> {
    const [result] = await db.execute(
      `INSERT INTO \`form\` (user_id, course_id, status, title) VALUES (?, ?, ?, ?)`,
      [form.user_id, form.course_id, form.status, form.title]
    );
    const insertId = (result as any).insertId;
    const [rows] = await db.execute('SELECT * FROM `form` WHERE id = ?', [insertId]);
    return (rows as Form[])[0];
  },

  async deleteForm(id: number): Promise<void> {
    await db.execute(`UPDATE \`form\` SET \`deleted\` = CURRENT_TIMESTAMP WHERE id = ?`, [id]);
  },

  async getFormById(id: number): Promise<iForm | null> {
    const [rows] = await db.execute('SELECT * FROM `form` WHERE id = ? AND `deleted` IS NULL', [id]);
    const forms = rows as iForm[];
    return forms.length > 0 ? forms[0] : null;
  },

  async updateFormTitle(formId: number, newTitle: string): Promise<iForm | null> {
    await db.execute(
      `UPDATE form SET title = ? WHERE id = ? AND deleted IS NULL`,
      [newTitle, formId]
    );

    const form = await this.getFormById(formId);
    return form || null;
  },

  async publishForm(formId: number): Promise<iForm | null> {
    await db.execute(
      `UPDATE form SET status = 'published' WHERE id = ? AND deleted IS NULL`,
      [formId]
    );

    const form = await this.getFormById(formId);
    return form || null;
  },

  async getFormsByUserId(userId: number) {
    const [rows] = await db.execute(
      `SELECT f.id, f.title, 
      CASE WHEN fa.form_id IS NOT NULL THEN 'answered' ELSE 'pending' END AS status
      FROM form f
      JOIN user_course uc ON f.course_id = uc.course_id
      LEFT JOIN form_answer fa ON f.id = fa.form_id AND fa.user_id = uc.user_id
      WHERE uc.user_id = ? AND f.status = 'published' AND f.deleted IS NULL
      Order by fa.created ASC`,
      [userId]
    );
    return rows;
  },
};
