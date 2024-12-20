import axios from 'axios';
import { CourseData } from '../context/CourseContext';

export const fetchAllCourses = async (): Promise<CourseData[]> => {
  const response = await axios.get('http://www.localhost:3000/api/courses');
  return response.data;
};
