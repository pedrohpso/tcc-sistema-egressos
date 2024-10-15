import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchAllCourses } from '../services/courseService';

export interface CourseData {
  id: number;
  name: string;
}

interface CourseContextType {
  selectedCourse: CourseData | null;
  setSelectedCourse: React.Dispatch<React.SetStateAction<CourseData | null>>;
  courses: CourseData[];
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [courses, setCourses] = useState<CourseData[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const courseList = await fetchAllCourses();
      setCourses(courseList);
      setSelectedCourse(courseList[0]); 
    };

    fetchCourses();
  }, []);

  return (
    <CourseContext.Provider value={{ selectedCourse, setSelectedCourse, courses }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};


