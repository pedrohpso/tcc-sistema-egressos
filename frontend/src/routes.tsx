import { Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage/Homepage';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Error from './components/Error/Error';
import Dashboard from './components/Dashboard/Dashboard';
import Alumni from './components/Alumni/Alumni';
import AlumniForm from './components/AlumniForm/AlumniForm'
import AdminLayout from './components/AdminLayout/AdminLayout';

export const routes = () => {
  return (
    <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<AdminLayout/>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="forms" element={<></>} />
        </Route>
        <Route path='/alumni' element={<Alumni />} />
        <Route path="/form/:id" element={<AlumniForm />} />
        <Route path="*" element={<Error name="Página não encontrada" />} />
    </Routes>
  );
}