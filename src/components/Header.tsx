import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserAlt, FaBell } from 'react-icons/fa';
import AuthPopup from './popups/AuthPopup';
import { checkIfLoggedIn, handleLogout } from '../services/auth';

const Header: React.FC = () => {
  const [isBellDropdownOpen, setIsBellDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authPopupOpen, setAuthPopupOpen] = useState(false);
  const [authView, setAuthView] = useState<'register' | 'login' | 'forgotPassword'>('login');
  const [intendedPath, setIntendedPath] = useState<string | null>(null);
  const navigate = useNavigate();
  const bellDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await checkIfLoggedIn();
      setIsLoggedIn(loggedIn);
      setLoading(false); // Set loading to false once login status is determined
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellDropdownRef.current && !bellDropdownRef.current.contains(event.target as Node)) {
        setIsBellDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [bellDropdownRef, userDropdownRef]);

  const toggleBellDropdown = () => {
    setIsBellDropdownOpen(!isBellDropdownOpen);
    setIsUserDropdownOpen(false);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setIsBellDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    handleLogout();
    setIsLoggedIn(false);
    navigate('/');
  };

  const openAuthPopup = (view: 'register' | 'login' | 'forgotPassword') => {
    setAuthView(view);
    setAuthPopupOpen(true);
  };

  const closeAuthPopup = () => {
    setAuthPopupOpen(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setAuthPopupOpen(false);
    if (intendedPath) {
      navigate(intendedPath);
      setIntendedPath(null);
    } else {
      window.location.reload(); // Refresh the page to update the header
    }
  };

  const handleFormClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setIntendedPath('/form');
      openAuthPopup('login');
    }
  };

  if (loading) {
    return <div className="loading-spinner">Загрузка...</div>; // Show loading spinner or placeholder
  }

  return (
    <>
      <header className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-[#4357ad] text-2xl font-bold hover:text-[#333]">
            Avito-Clone
          </Link>
          <div className="flex items-center space-x-8">
            <Link to="/list" className="text-gray-700 hover:text-[#4357ad] hover:underline">
              Список объявлений
            </Link>
            <Link to="/form" onClick={handleFormClick} className="text-gray-700 hover:text-[#4357ad] hover:underline">
              Разместить объявление
            </Link>
            {isLoggedIn && (
              <Link to="/my-ads" className="text-gray-700 hover:text-[#4357ad] hover:underline">
                Мои объявления
              </Link>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn && (
              <div className="relative" ref={bellDropdownRef}>
                <button
                  onClick={toggleBellDropdown}
                  className="text-gray-700 hover:text-[#4357ad] flex items-center focus:outline-none"
                >
                  <FaBell className="cursor-pointer" />
                </button>
                {isBellDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                    <div className="block px-4 py-2 text-gray-700 cursor-pointer">
                      Нет уведомлений
                    </div>
                  </div>
                )}
              </div>
            )}
            {isLoggedIn ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={toggleUserDropdown}
                  className="text-gray-700 hover:text-[#4357ad] flex items-center focus:outline-none"
                >
                  <FaUserAlt className="cursor-pointer" />
                </button>
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                    <button
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer"
                      onClick={handleLogoutClick}
                    >
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => openAuthPopup('register')}
                  className="bg-[#4357ad] text-white px-4 py-2 rounded-md hover:bg-[#333] hover:cursor-pointer focus:outline-none"
                >
                  Регистрация
                </button>
                <button
                  onClick={() => openAuthPopup('login')}
                  className="bg-[#4357ad] text-white px-4 py-2 rounded-md hover:bg-[#333] hover:cursor-pointer focus:outline-none"
                >
                  Войти
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      {authPopupOpen && <AuthPopup onClose={closeAuthPopup} view={authView} onLoginSuccess={handleLoginSuccess} />}
    </>
  );
};

export default Header;