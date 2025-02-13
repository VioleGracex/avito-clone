import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUserAlt, FaBell } from 'react-icons/fa';
import AuthPopup from './popups/AuthPopup';
import { checkIfLoggedIn, handleLogout } from '../services/auth';

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authPopupOpen, setAuthPopupOpen] = useState(false);
  const [authView, setAuthView] = useState<'register' | 'login' | 'forgotPassword'>('login');
  const [intendedPath, setIntendedPath] = useState<string | null>(null);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await checkIfLoggedIn();
      setIsLoggedIn(loggedIn);
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
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

  return (
    <>
      <header className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-[#4357ad] text-2xl font-bold hover:text-[#333]">
              Avito-Clone
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link to="/form" onClick={handleFormClick} className="text-gray-700 hover:text-[#4357ad] hover:underline">
                Создать объявление
              </Link>
              <Link to="/list" className="text-gray-700 hover:text-[#4357ad] hover:underline">
                Список объявлений
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск..."
                className="border rounded-full py-2 px-4 pl-10 w-full"
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            <Link to="/notifications" className="text-gray-700 hover:text-[#4357ad]">
              <FaBell />
            </Link>
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="text-gray-700 hover:text-[#4357ad] flex items-center"
                >
                  <FaUserAlt className="cursor-pointer" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:underline cursor-pointer"
                      onClick={closeDropdown}
                    >
                      Профиль
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:underline cursor-pointer"
                      onClick={closeDropdown}
                    >
                      Настройки
                    </Link>
                    <button
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:underline w-full text-left cursor-pointer"
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
                  className="text-gray-700 hover:text-[#4357ad] hover:underline cursor-pointer"
                >
                  Регистрация
                </button>
                <button
                  onClick={() => openAuthPopup('login')}
                  className="text-gray-700 hover:text-[#4357ad] hover:underline cursor-pointer"
                >
                  Войти
                </button>
              </>
            )}
          </div>
        </div>
        <nav className="container mx-auto mt-4 md:hidden flex justify-center space-x-4">
          <Link to="/form" onClick={handleFormClick} className="text-gray-700 hover:text-[#4357ad] hover:underline">
            Создать объявление
          </Link>
          <Link to="/list" className="text-gray-700 hover:text-[#4357ad] hover:underline">
            Список объявлений
          </Link>
        </nav>
      </header>
      {authPopupOpen && <AuthPopup onClose={closeAuthPopup} view={authView} onLoginSuccess={handleLoginSuccess} />}
    </>
  );
};

export default Header;