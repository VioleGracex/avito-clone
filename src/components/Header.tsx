import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUserAlt, FaBell } from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <header className="bg-white  shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-[#4357ad] text-2xl font-bold">Avito-Clone</Link>
          <nav className="hidden md:flex space-x-4">
            <Link to="/form" className="text-gray-700 hover:text-[#4357ad]">Создать объявление</Link>
            <Link to="/list" className="text-gray-700 hover:text-[#4357ad]">Список объявлений</Link>
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
          <Link to="/profile" className="text-gray-700 hover:text-[#4357ad]">
            <FaUserAlt />
          </Link>
        </div>
      </div>
      <nav className="container mx-auto mt-4 md:hidden flex justify-center space-x-4">
        <Link to="/form" className="text-gray-700 hover:text-[#4357ad]">Создать объявление</Link>
        <Link to="/list" className="text-gray-700 hover:text-[#4357ad]">Список объявлений</Link>
      </nav>
    </header>
  );
};

export default Header;