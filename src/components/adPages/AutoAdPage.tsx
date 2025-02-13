import React, { useState } from 'react';
import { AutoAd } from '../../types/Ad';
import { FaTag, FaCoins, FaCar, FaCalendarAlt, FaTachometerAlt, FaWrench, FaCogs, FaGasPump, FaRoad, FaUser, FaClipboardCheck, FaKey, FaPaintRoller, FaExchangeAlt, FaPlus, FaInfoCircle } from 'react-icons/fa';
import ContactPanel from './AdComponents/ContactPanel';
import ImageGallery from './AdComponents/AdImageGallery';

interface AutoAdPageProps {
  ad: AutoAd;
}

const AutoAdPage: React.FC<AutoAdPageProps> = ({ ad }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="container mx-auto p-4 flex flex-col lg:flex-row">
      <div className="w-full lg:w-2/3">
        <ImageGallery images={ad.images || []} currentImageIndex={currentImageIndex} setCurrentImageIndex={setCurrentImageIndex} />
        <div className="text-3xl font-bold mb-4">{ad.name || 'Инфо отсутствует'}</div>
        <div className="text-xl text-gray-700 flex items-center mb-2">
          <FaCoins className="mr-1" /> {ad.price || 'Инфо отсутствует'} ₽
        </div>
        <div className="text-xl text-gray-700 flex items-center mb-2">
          <FaTag className="mr-1" /> {ad.type || 'Инфо отсутствует'}
        </div>
        <div className="text-xl text-gray-700 flex items-center mb-2">
          <FaCar className="mr-1" /> {ad.brand || 'Инфо отсутствует'} {ad.model || 'Инфо отсутствует'}
        </div>
        <div className="text-xl text-gray-700 flex items-center mb-2">
          <FaCalendarAlt className="mr-1" /> {ad.year || 'Инфо отсутствует'}
        </div>
        <div className="text-xl text-gray-700 flex items-center mb-8">
          <FaTachometerAlt className="mr-1" /> {ad.mileage || 'Инфо отсутствует'} км
        </div>
        <h2 className="text-3xl font-bold mb-4">Характеристики</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-lg text-gray-700 mb-8">
          <div className="flex items-center"><FaCalendarAlt className="mr-2" />Год выпуска: {ad.year || 'Инфо отсутствует'}</div>
          <div className="flex items-center"><FaWrench className="mr-2" />Поколение: {ad.generation || 'Инфо отсутствует'}</div>
          <div className="flex items-center"><FaRoad className="mr-2" />Пробег: {ad.mileage || 'Инфо отсутствует'} км</div>
          <div className="flex items-center"><FaClipboardCheck className="mr-2" />История пробега: {ad.mileageHistory || 'Инфо отсутствует'}</div>
          <div className="flex items-center"><FaKey className="mr-2" />ПТС: {ad.pts || 'Инфо отсутствует'}</div>
          <div className="flex items-center"><FaUser className="mr-2" />Владельцев по ПТС: {ad.owners || 'Инфо отсутствует'}</div>
          <div className="flex items-center"><FaInfoCircle className="mr-2" />Состояние: {ad.condition || 'Инфо отсутствует'}</div>
          <div className="flex items-center"><FaCogs className="mr-2" />Модификация: {ad.modification || 'Инфо отсутствует'}</div>
          <div className="flex items-center"><FaGasPump className="mr-2" />Объём двигателя: {ad.engineVolume || 'Инфо отсутствует'} л</div>
          <div className="flex items-center"><FaPlus className="mr-2" />Тип двигателя: {ad.engineType || 'Инфо отсутствует'}</div>
          <div className="flex items-center"><FaCogs className="mr-2" />Коробка передач: {ad.transmission || 'Инфо отсутствует'}</div>
          <div className="flex items-center"><FaRoad className="mr-2" />Привод: {ad.driveType || 'Инфо отсутствует'}</div>
          <div className="flex items-center"><FaWrench className="mr-2" />Комплектация: {ad.configuration || 'Инфо отсутствует'}</div>
          <div className="flex items-center"><FaCar className="mr-2" />Тип кузова: {ad.bodyType || 'Инфо отсутствует'}</div>
          <div className="flex items-center"><FaPaintRoller className="mr-2" />Цвет: {ad.color || 'Инфо отсутствует'}</div>
          <div className="flex items-center"><FaCar className="mr-2" />Руль: {ad.steeringWheel || 'Инфо отсутствует'}</div>
          <div className="flex items-center"><FaInfoCircle className="mr-2" />VIN или номер кузова: {ad.vin || 'Инфо отсутствует'}</div>
          <div className="flex items-center"><FaExchangeAlt className="mr-2" />Обмен: {ad.exchange ? 'да' : 'Инфо отсутствует'}</div>
        </div>
        <h2 className="text-3xl font-bold mb-4">Описание</h2>
        <div className="text-lg text-gray-700 mb-8">{ad.description || 'Инфо отсутствует'}</div>
        <h2 className="text-3xl font-bold mb-4">Расположение</h2>
        <p className="text-lg text-gray-700">{ad.location || 'Инфо отсутствует'}</p>
      </div>
      <div className="w-full lg:w-1/3 lg:pl-4 lg:sticky lg:top-4">
        <ContactPanel />
      </div>
    </div>
  );
};

export default AutoAdPage;