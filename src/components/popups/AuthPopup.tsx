import React, { useState, useRef, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import RegisterForm from '../forms/AuthForms/RegisterForm';
import LoginForm from '../forms/AuthForms/LoginForm';

interface AuthPopupProps {
  onClose: () => void;
  view: 'register' | 'login' | 'forgotPassword';
  onLoginSuccess?: () => void;
}

interface Notification {
  type: 'error' | 'success';
  message: string;
}

const AuthPopup: React.FC<AuthPopupProps> = ({ onClose, view, onLoginSuccess }) => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [currentView, setCurrentView] = useState(view);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentView(view);
  }, [view]);

  const handleOutsideClick = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  });

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000); // Notification disappears after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="fixed inset-0 bg-gray-800/75 flex justify-center items-center z-50">
      <div ref={modalRef} className="bg-white p-6 rounded-lg relative z-50 w-full max-w-md shadow-lg">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-700 hover:text-gray-900">
          <FaTimes size={20} />
        </button>
        {notification && (
          <div className={`mb-4 p-2 rounded-lg ${notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
            {notification.message}
          </div>
        )}
        {currentView === 'register' && <RegisterForm setCurrentView={setCurrentView} setNotification={setNotification} />}
        {currentView === 'login' && <LoginForm setCurrentView={setCurrentView} setNotification={setNotification} onLoginSuccess={onLoginSuccess} />}
        {/* Add ForgotPasswordForm component here if needed */}
      </div>
    </div>
  );
};

export default AuthPopup;