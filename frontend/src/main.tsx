import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { UserProvider } from './context/UserContext'
import { CourseProvider } from './context/CourseContext.tsx'

createRoot(document.getElementById('root')!).render(
    <CourseProvider>
      <UserProvider>
        <App/>
      </UserProvider>
    </CourseProvider>
)
