import { db } from '../utils/db';

interface CreateAnswerInput {
  fieldId: number;
  formAnswerId: number;
  fieldOptionId: number | null;
  text: string | null;
}

export const answerModel = {
  async createFormAnswer(userId: number, formId: number) {
    const [result] = await db.execute(
      `INSERT INTO form_answer (user_id, form_id) VALUES (?, ?)`,
      [userId, formId]
    );

    return (result as any).insertId;
  },

  async createAnswer({ fieldId, formAnswerId, fieldOptionId, text }: CreateAnswerInput) {
    await db.execute(
      `INSERT INTO answer (field_id, form_answer_id, field_option_id, text) VALUES (?, ?, ?, ?)`,
      [fieldId, formAnswerId, fieldOptionId, text]
    );
  }
};
