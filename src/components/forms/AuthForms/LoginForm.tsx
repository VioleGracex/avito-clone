import React, { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { loginUser } from '../../../services/auth';

interface LoginFormProps {
  setCurrentView: (view: 'register' | 'login' | 'forgotPassword') => void;
  setNotification: (notification: { type: 'error' | 'success'; message: string } | null) => void;
  onLoginSuccess?: () => void;
}

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const LoginForm: React.FC<LoginFormProps> = ({ setCurrentView, setNotification, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const login = async () => {
    const newErrors = { email: '', password: '' };
    if (!email) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Неверный формат email';
    }
    if (!password) {
      newErrors.password = 'Пароль обязателен для заполнения';
    }
    setErrors(newErrors);

    if (newErrors.email || newErrors.password) {
      setNotification({ type: 'error', message: 'Пожалуйста, исправьте ошибки в форме' });
      return;
    }

    try {
      await loginUser(email, password);
      setNotification({ type: 'success', message: 'Вход успешен' });
      setEmail('');
      setPassword('');
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      if (error instanceof Error) {
        setNotification({ type: 'error', message: error.message });
      } else {
        setNotification({ type: 'error', message: 'Произошла неизвестная ошибка' });
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-center text-2xl mb-4">Вход</h2>
      <div className="form-group mb-4">
        <label htmlFor="loginEmail" className="block mb-2">Email</label>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <FaEnvelope className="ml-2 text-gray-500" />
          <input
            type="email"
            id="loginEmail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 ml-2 border-0 focus:ring-0 rounded-r-lg"
            required
          />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>
      <div className="form-group mb-4">
        <label htmlFor="loginPassword" className="block mb-2">Пароль</label>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <FaLock className="ml-2 text-gray-500" />
          <input
            type="password"
            id="loginPassword"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 ml-2 border-0 focus:ring-0 rounded-r-lg"
            required
          />
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>
      <div className="form-group mb-4">
        <button onClick={login} className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Войти</button>
      </div>
      <div className="text-center">
        <button onClick={() => setCurrentView('register')} className="text-blue-500 hover:underline">Нет аккаунта? Зарегистрироваться</button>
      </div>
    </div>
  );
};

export default LoginForm;