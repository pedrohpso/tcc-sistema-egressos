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
  }
}
