import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useUser } from '../../context/UserContext';
// import { updatePassword, getUserProfile } from '../../services/userService';
import Form from '../Form/Form';
import { FormFieldProps } from '../Form/FormField/FormField';
import { getUserData, updatePassword } from '../../services/userService';

interface ProfileData {
  name?: string;
  email?: string;
  birthdate?: string;
  gender?: string;
  ethnicity?: string;
  graduation_year?: string;
}

const Profile: React.FC = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getUserData();
        setProfile(profileData);
      } catch (error) {
        console.error('Erro ao carregar o perfil:', error);
      }
    };

    fetchProfile();
  }, []);

  const handlePasswordChange = async (formData: { [key: string]: string | string[] }) => {
    console.log('formData:', formData);
    
    const currentPass = formData.currentPassword as string;
    const newPass = formData.newPassword as string;
    const confirmPass = formData.confirmPassword as string;
    
    if (newPass !== confirmPass) {
      setMessage('As senhas não coincidem.');
      return;
    }

    try {
      await updatePassword(currentPass, newPass);
      setMessage('Senha atualizada com sucesso.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Erro ao atualizar a senha:', error);
      setMessage('Erro ao atualizar a senha: '+ error.response.data.message);
    }
  };

  if (!profile) return <h1 className='loading-text'>Carregando perfil...</h1>;

  const fields: FormFieldProps[] = [
    {
      type: 'password',
      label: 'Senha atual',
      required: true,
      name: 'currentPassword',
      value: currentPassword,
      onChange: (e) => setCurrentPassword(e),
    },
    {
      type: 'password',
      label: 'Nova Senha',
      required: true,
      name: 'newPassword',
      value: newPassword,
      onChange: (e) => setNewPassword(e),
    },
    {
      type: 'password',
      label: 'Confirmar Nova Senha',
      required: true,
      name: 'confirmPassword',
      value: confirmPassword,
      onChange: (e) => setConfirmPassword(e),
    },
  ];

  return (
    <div className="profile-container">
      <div className="profile-info-section">
        <h2>Perfil</h2>
        <label>Nome:</label>
        <input type="text" value={profile.name || ''} disabled />
        
        <label>Email:</label>
        <input type="email" value={profile.email || ''} disabled />

        {user && !user.is_admin && (
          <>
            <label>Data de Nascimento:</label>
            <input type="text" value={profile.birthdate || ''} disabled />

            <label>Gênero:</label>
            <input type="text" value={profile.gender || ''} disabled />

            <label>Etnia:</label>
            <input type="text" value={profile.ethnicity || ''} disabled />

            <label>Ano de Graduação:</label>
            <input type="text" value={profile.graduation_year || ''} disabled />
          </>
        )}
      </div>

      <div className="password-change-container">
        <h3>Alterar Senha</h3>
        <Form fields={fields} onSubmit={handlePasswordChange} />
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Profile;
