import { Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage/Homepage';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Error from './components/Error/Error';
import AdminData from './components/AdminData/AdminData';
import Alumni from './components/Alumni/Alumni';
import AlumniForm from './components/AlumniForm/AlumniForm'
import AdminLayout from './components/AdminLayout/AdminLayout';
import AdminFormPage from './components/AdminFormPage/AdminFormPage';
import AdminFormEditPage from './components/AdminFormEditPage/AdminFormEditPage';
import Dashboard from './components/Dashboard/Dashboard';
import PasswordRecovery from './components/PasswordRecovery/PasswordRecovery';
import PasswordReset from './components/PasswordReset/PasswordReset';
import Profile from './components/Profile/Profile';
import AdminRegister from './components/AdminRegister/AdminRegister';
import FormResponsesPage from './components/FormResponsesPage/FormResponsesPage';
import UserAnswersPage from './components/UserAnswersPage/UserAnswersPage';

export const routes = () => {
  return (
    <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password-recovery" element={<PasswordRecovery />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/admin/*" element={<AdminLayout/>}>
          <Route path="dashboard" element={<Dashboard/>} />
          <Route path="data" element={<AdminData />} />
          <Route path="forms" element={<AdminFormPage />} />
          <Route path="forms/:formId" element={<AdminFormEditPage/>} />
          <Route path="forms/:formId/responses" element={<FormResponsesPage />} />
          <Route path="forms/:formId/responses/:userId" element={<UserAnswersPage />} />
          <Route path="register-admin" element={<AdminRegister />} />
        </Route>
        <Route path="/profile" element={<Profile />} />
        <Route path='/alumni' element={<Alumni />} />
        <Route path="/form/:id" element={<AlumniForm />} />
        <Route path="*" element={<Error name="Página não encontrada" />} />
    </Routes>
  );
}