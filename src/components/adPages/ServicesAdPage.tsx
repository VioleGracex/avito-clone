import React, { useState } from 'react';
import { ServicesAd } from '../../types/Ad';
import { FaTag, FaCoins, FaWrench, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import ContactPanel from './AdComponents/ContactPanel';
import ImageGallery from './AdComponents/AdImageGallery';

interface ServicesAdPageProps {
  ad: ServicesAd;
}

const ServicesAdPage: React.FC<ServicesAdPageProps> = ({ ad }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-4">
      <div className="w-full lg:w-2/3">
        <ImageGallery images={ad.images || []} currentImageIndex={currentImageIndex} setCurrentImageIndex={setCurrentImageIndex} />
        <div className="text-3xl font-bold mb-4">{ad.name || 'Инфо отсутствует'}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xl text-gray-700 mb-8">
          <div className="flex items-center">
            <FaCoins className="mr-2" />
            <span>{ad.price || 'Инфо отсутствует'} ₽</span>
          </div>
          <div className="flex items-center">
            <FaTag className="mr-2" />
            <span>{ad.type || 'Инфо отсутствует'}</span>
          </div>
          <div className="flex items-center">
            <FaWrench className="mr-2" />
            <span>{ad.serviceType || 'Инфо отсутствует'}</span>
          </div>
          <div className="flex items-center">
            <FaBriefcase className="mr-2" />
            <span>Опыт: {ad.experience || 'Инфо отсутствует'} лет</span>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2" />
            <span>Стоимость: {ad.cost || 'Инфо отсутствует'} ₽</span>
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4">Описание</h2>
        <div className="text-lg text-gray-700 mb-8">{ad.description || 'Инфо отсутствует'}</div>
        <h2 className="text-3xl font-bold mb-4">Расположение</h2>
        <p className="text-lg text-gray-700">{ad.location || 'Инфо отсутствует'}</p>
        <h2 className="text-3xl font-bold mb-4">Подробности</h2>
        <div className="text-lg text-gray-700 mb-8">
          <div className="flex items-center mb-2">
            <FaWrench className="mr-2" />
            <span>Тип услуги: {ad.serviceType || 'Инфо отсутствует'}</span>
          </div>
          <div className="flex items-center mb-2">
            <FaBriefcase className="mr-2" />
            <span>Опыт: {ad.experience || 'Инфо отсутствует'} лет</span>
          </div>
          <div className="flex items-center mb-2">
            <FaCalendarAlt className="mr-2" />
            <span>Стоимость: {ad.cost || 'Инфо отсутствует'} ₽</span>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/3 lg:sticky lg:top-4">
        <ContactPanel />
      </div>
    </div>
  );
};

export default ServicesAdPage;