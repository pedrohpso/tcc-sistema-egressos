import React, { createContext, useContext, useState, useEffect } from 'react';

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
    // Trocar depois para uma chamada pro backend
    const fetchCourses = () => {
      const courseList = [
        { id: 1, name: 'Análise e Desenvolvimento de Sistemas' },
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


