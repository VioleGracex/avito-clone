import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUserAlt, FaBell } from 'react-icons/fa';
import { handleLogout } from '../services/auth';

interface HeaderProps {
  loggedIn: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ loggedIn, onLogout }) => {
  const [isBellDropdownOpen, setIsBellDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const bellDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

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
    onLogout();
    navigate('/');
  };

  const handleFormClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!loggedIn) {
      e.preventDefault();
      navigate('/login?intendedPath=/form');
    }
  };

  const getLinkClassName = (path: string) => {
    return location.pathname === path ? 'text-[#4357ad] underline' : 'text-gray-700 hover:text-[#4357ad] hover:underline';
  };

  return (
    <header className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-[#4357ad] text-2xl font-bold hover:text-[#333]">
          Avito-Clone
        </Link>
        <div className="flex items-center space-x-8">
          <Link to="/list" className={getLinkClassName('/list')}>
            Список объявлений
          </Link>
          <Link to="/form" onClick={handleFormClick} className={getLinkClassName('/form')}>
            Разместить объявление
          </Link>
          {loggedIn && (
            <Link to="/my-ads" className={getLinkClassName('/my-ads')}>
              Мои объявления
            </Link>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {loggedIn && (
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
          {loggedIn ? (
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
              <Link
                to="/login?intendedPath=/register"
                className="bg-[#4357ad] text-white px-4 py-2 rounded-md hover:bg-[#333] focus:outline-none"
              >
                Регистрация
              </Link>
              <Link
                to="/login"
                className="bg-[#4357ad] text-white px-4 py-2 rounded-md hover:bg-[#333] focus:outline-none"
              >
                Войти
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;