import { RowDataPacket } from 'mysql2';
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
  async getFormsByCourseId(courseId: number) {
    const [rows] = await db.execute(
      'SELECT id, title, status FROM form WHERE course_id = ? AND deleted IS NULL ORDER BY created DESC',
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
    return form;
  },

  async publishForm(formId: number): Promise<iForm | null> {
    await db.execute(
      `UPDATE form SET status = 'published' WHERE id = ? AND deleted IS NULL`,
      [formId]
    );

    const form = await this.getFormById(formId);
    return form;
  },

  async getFormsByUserId(userId: number) {
    const [rows] = await db.execute(
      `SELECT f.id, f.title, 
      CASE WHEN fa.form_id IS NOT NULL THEN 'answered' ELSE 'pending' END AS status
      FROM form f
      JOIN user_course uc ON f.course_id = uc.course_id
      LEFT JOIN form_answer fa ON f.id = fa.form_id AND fa.user_id = uc.user_id
      WHERE uc.user_id = ? AND f.status = 'published' 
        AND f.deleted IS NULL AND fa.deleted IS NULL
      Order by fa.created ASC`,
      [userId]
    );
    return rows;
  },

  async getPublishedFormsByCourse(courseId: number) {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT f.id, f.title, f.status
     FROM form f
     JOIN field fld ON fld.form_id = f.id
     WHERE f.course_id = ? AND f.status = 'published' 
      AND fld.type IN ('single_choice', 'multiple_choice') 
      AND f.deleted IS NULL
      AND fld.deleted IS NULL
     GROUP BY f.id
     HAVING COUNT(fld.id) > 0`,
      [courseId]
    );

    return rows;
  },

  async getGroupedDataByIndicator({ courseId, startYear, endYear, indicatorId, grouping }: { courseId: number, startYear: number, endYear: number, indicatorId: number, grouping: string }) {

    let groupingColumn;
    switch (grouping) {
      case 'gender':
        groupingColumn = 'user.gender';
        break;
      case 'ethnicity':
        groupingColumn = 'user.ethnicity';
        break;
      case 'age':
        groupingColumn = `CASE 
                            WHEN TIMESTAMPDIFF(YEAR, user.birthdate, form_answer.created) < 20 THEN '20-'
                            WHEN TIMESTAMPDIFF(YEAR, user.birthdate, form_answer.created) BETWEEN 20 AND 23 THEN '21-23'
                            WHEN TIMESTAMPDIFF(YEAR, user.birthdate, form_answer.created) BETWEEN 24 AND 26 THEN '24-26'
                            WHEN TIMESTAMPDIFF(YEAR, user.birthdate, form_answer.created) BETWEEN 27 AND 29 THEN '27-29'
                            ELSE '30+' 
                          END`;
        break;
      default:
        groupingColumn = `'Total'`;
        break;
    }

    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT ${groupingColumn} AS group_label, COUNT(answer.field_option_id) AS response_count, field_option.text AS option_text
   FROM form
   JOIN form_answer ON form.id = form_answer.form_id
   JOIN answer ON form_answer.id = answer.form_answer_id
   JOIN field ON answer.field_id = field.id
   JOIN field_option ON answer.field_option_id = field_option.id
   JOIN user ON form_answer.user_id = user.id
   JOIN indicator ON indicator.field_id = field.id
   WHERE form.course_id = ?
     AND form.status = 'published'
     AND indicator.id = ?
     AND user.graduation_year BETWEEN ? AND ?
     AND form.deleted IS NULL
     AND form_answer.deleted IS NULL
     AND answer.deleted IS NULL
     AND user.deleted IS NULL
     AND field.deleted IS NULL
     AND field_option.deleted IS NULL
   GROUP BY group_label, answer.field_option_id
   ORDER BY group_label, response_count DESC`,
      [courseId, indicatorId, startYear, endYear]
    );

    return rows;
  },

  async getAnswersByUser(formId: number, userId: number) {
    const [rows] = await db.execute(
      `SELECT f.question AS question, 
      GROUP_CONCAT(COALESCE(fo.text, a.text) ORDER BY fo.id SEPARATOR ', ') AS answer
      FROM form_answer fa
      JOIN answer a ON fa.id = a.form_answer_id
      JOIN field f ON a.field_id = f.id
      LEFT JOIN field_option fo ON a.field_option_id = fo.id
      WHERE fa.form_id = ? AND fa.user_id = ? 
       AND fa.deleted IS NULL 
       AND a.deleted IS NULL
      GROUP BY f.id
      ORDER BY f.position`,
      [formId, userId]
    );
    return rows;
  },

  async getUsersByForm(formId: number) {
    const [rows] = await db.execute(
      `SELECT u.id, u.name, u.email
       FROM form_answer fa
       JOIN user u ON fa.user_id = u.id
       WHERE fa.form_id = ? AND fa.deleted IS NULL AND u.deleted IS NULL
       GROUP BY u.id
       ORDER BY u.name`,
      [formId]
    );
    return rows;
  },

};
