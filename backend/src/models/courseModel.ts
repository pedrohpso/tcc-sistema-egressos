import { RowDataPacket } from 'mysql2';
import { db } from '../utils/db';

interface Course {
  id: number;
  name: string;
  created: Date;
  modified: Date;
}

export const courseModel = {
  async getAllCourses(): Promise<Course[]> {
    const [rows] = await db.execute(`SELECT id, name FROM course`);
    const courses = rows as Course[];
    return courses;
  },

  async getDashboardSummary(courseId: number) {
    const [publishedForms] = await db.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS publishedFormsAmount 
       FROM form 
       WHERE course_id = ? AND status = 'published' AND deleted IS NULL`,
      [courseId]
    );

    const [indicators] = await db.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS indicatorsAmount 
       FROM field 
       WHERE form_id IN (SELECT id FROM form WHERE course_id = ? AND status = 'published' AND deleted IS NULL)
         AND type IN ('single_choice', 'multiple_choice') AND deleted IS NULL`,
      [courseId]
    );

    const [alumni] = await db.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS registeredAlumniAmount 
       FROM user 
       WHERE graduation_year IS NOT NULL AND deleted IS NULL`
    );

    const registeredAlumniAmount = alumni[0]?.registeredAlumniAmount || 0;

    const [lastPublishedForm] = await db.execute<RowDataPacket[]>(
      `SELECT title AS lastPublishedFormTitle 
       FROM form 
       WHERE course_id = ? AND status = 'published' AND deleted IS NULL 
       ORDER BY created DESC 
       LIMIT 1`,
      [courseId]
    );

    const [formReach] = await db.execute<RowDataPacket[]>(
      `SELECT AVG(reach.form_response_percentage) AS formReachAverage
      FROM (
       SELECT COUNT(form_answer.id) / ? * 100 AS form_response_percentage 
       FROM form
       LEFT JOIN form_answer ON form.id = form_answer.form_id
       WHERE form.course_id = ? AND form.status = 'published' AND form.deleted IS NULL
       GROUP BY form.id
     ) AS reach`,
      [registeredAlumniAmount, courseId]
    );
    console.log('formReach: ', formReach)
    return {
      publishedFormsAmount: publishedForms[0]?.publishedFormsAmount || 0,
      indicatorsAmount: indicators[0]?.indicatorsAmount || 0,
      registeredAlumniAmount: alumni[0]?.registeredAlumniAmount || 0,
      lastPublishedFormTitle: lastPublishedForm[0]?.lastPublishedFormTitle || 'N/A',
      formReachAverage: formReach[0]?.formReachAverage || 0,
    };
  }
}
