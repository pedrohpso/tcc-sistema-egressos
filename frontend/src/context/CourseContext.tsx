import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CourseData {
  id: number;
  shortname: string;
  fullname: string;
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
    // Trocar depois para uma chamada pro backend
    const fetchCourses = () => {
      const courseList = [
        { id: 1, shortname: 'TADS', fullname: 'Tecnologia em Análise e Desenvolvimento de Sistemas' },
        { id: 2, shortname: 'Curso 2', fullname: 'Curso 2' },
      ];
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


