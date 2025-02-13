import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { registerUser } from '../../../services/auth';

interface RegisterFormProps {
  setCurrentView: (view: 'register' | 'login' | 'forgotPassword') => void;
  setNotification: (notification: { type: 'error' | 'success'; message: string } | null) => void;
}

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string) => {
  // Пароль должен содержать минимум 8 символов, включать одну цифру, одну заглавную и одну строчную букву
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return passwordRegex.test(password);
};

const RegisterForm: React.FC<RegisterFormProps> = ({ setCurrentView, setNotification }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', email: '', password: '' });

  const register = async () => {
    const newErrors = { username: '', email: '', password: '' };
    if (!username) {
      newErrors.username = 'Имя пользователя обязательно для заполнения';
    }
    if (!email) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Неверный формат email';
    }
    if (!password) {
      newErrors.password = 'Пароль обязателен для заполнения';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Пароль должен содержать минимум 8 символов, включать одну цифру, одну заглавную и одну строчную букву';
    }
    setErrors(newErrors);

    if (newErrors.username || newErrors.email || newErrors.password) {
      setNotification({ type: 'error', message: 'Пожалуйста, исправьте ошибки в форме' });
      return;
    }

    try {
      await registerUser(username, email, password);
      setNotification({ type: 'success', message: 'Регистрация успешна' });
      setUsername('');
      setEmail('');
      setPassword('');
      setCurrentView('login');
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
      <h2 className="text-center text-2xl mb-4">Регистрация</h2>
      <div className="form-group mb-4">
        <label htmlFor="username" className="block mb-2">Имя пользователя</label>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <FaUser className="ml-2 text-gray-500" />
          <input
            type="text"
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full p-2 ml-2 border-0 focus:ring-0 rounded-r-lg"
            required
          />
        </div>
        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
      </div>
      <div className="form-group mb-4">
        <label htmlFor="email" className="block mb-2">Email</label>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <FaEnvelope className="ml-2 text-gray-500" />
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 ml-2 border-0 focus:ring-0 rounded-r-lg"
            required
          />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>
      <div className="form-group mb-4">
        <label htmlFor="password" className="block mb-2">Пароль</label>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <FaLock className="ml-2 text-gray-500" />
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 ml-2 border-0 focus:ring-0 rounded-r-lg"
            required
          />
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>
      <div className="form-group mb-4">
        <button onClick={register} className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Зарегистрироваться</button>
      </div>
      <div className="text-center">
        <button onClick={() => setCurrentView('login')} className="text-blue-500 hover:underline">Уже есть аккаунт? Войти</button>
      </div>
    </div>
  );
};

export default RegisterForm;