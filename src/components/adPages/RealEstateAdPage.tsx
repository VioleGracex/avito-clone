import React, { useState } from 'react';
import { RealEstateAd } from '../../types/Ad';
import { FaMapMarkerAlt, FaTag, FaCoins, FaBed, FaRulerCombined, FaBath, FaCouch, FaTv, FaWifi, FaSmokingBan, FaChild, FaDog } from 'react-icons/fa';
import ContactPanel from './AdComponents/ContactPanel';
import ImageGallery from './AdComponents/AdImageGallery';

interface RealEstateAdPageProps {
  ad: RealEstateAd;
}

const RealEstateAdPage: React.FC<RealEstateAdPageProps> = ({ ad }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-4">
      <div className="w-full lg:w-2/3">
        <ImageGallery images={ad.images || []} currentImageIndex={currentImageIndex} setCurrentImageIndex={setCurrentImageIndex} />
        <div className="text-2xl font-bold mb-4">{ad.name || 'Инфо отсутствует'}</div>
        <div className="text-gray-700 flex items-center mb-2">
          <FaCoins className="mr-1" /> {ad.price || 'Инфо отсутствует'} ₽/мес
        </div>
        <div className="text-gray-700 flex items-center mb-2">
          <FaTag className="mr-1" /> {ad.type || 'Инфо отсутствует'}
        </div>
        <div className="text-gray-700 flex items-center mb-2">
          <FaMapMarkerAlt className="mr-1" /> {ad.location || 'Инфо отсутствует'}
        </div>
        <div className="text-gray-700 mb-8">{ad.description || 'Инфо отсутствует'}</div>
        <h2 className="text-2xl font-bold mb-4">Об апартаментах</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center"><FaBed className="mr-2" />Количество комнат: {ad.rooms || 'Инфо отсутствует'}</div>
          <div className="flex items-center"><FaRulerCombined className="mr-2" />Общая площадь: {ad.area || 'Инфо отсутствует'} м²</div>
          <div className="flex items-center"><FaBath className="mr-2" />Санузел: {ad.bathroom || 'Инфо отсутствует'}</div>
          <div className="flex items-center"><FaCouch className="mr-2" />Мебель: {ad.furniture || 'Инфо отсутствует'}</div>
          <div className="flex items-center"><FaTv className="mr-2" />Техника: {ad.appliances || 'Инфо отсутствует'}</div>
          <div className="flex items-center"><FaWifi className="mr-2" />Интернет и ТВ: {ad.internetAndTv || 'Инфо отсутствует'}</div>
        </div>
        <h2 className="text-2xl font-bold mb-4">Условия аренды</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center"><FaCoins className="mr-2" />Залог: {ad.deposit || 'Инфо отсутствует'}</div>
          <div className="flex items-center"><FaCoins className="mr-2" />Комиссия: {ad.commission || 'Инфо отсутствует'}</div>
          <div className="flex items-center"><FaCoins className="mr-2" />По счетчикам: {ad.meterPay || 'Инфо отсутствует'}</div>
          <div className="flex items-center"><FaCoins className="mr-2" />Другие ЖКУ: {ad.otherUtilities || 'Инфо отсутствует'}</div>
        </div>
        <h2 className="text-2xl font-bold mb-4">Правила</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center"><FaChild className="mr-2" />Можно с детьми: {ad.childrenAllowed ? 'да' : 'Инфо отсутствует'}</div>
          <div className="flex items-center"><FaDog className="mr-2" />Можно с животными: {ad.petsAllowed ? 'да' : 'Инфо отсутствует'}</div>
          <div className="flex items-center"><FaSmokingBan className="mr-2" />Можно курить: {ad.smokingAllowed ? 'да' : 'Инфо отсутствует'}</div>
        </div>
        <h2 className="text-2xl font-bold mb-4">Расположение</h2>
        <p>{ad.location || 'Инфо отсутствует'}</p>
      </div>
      <div className="w-full lg:w-1/3 lg:pl-4 mt-8 lg:mt-0 lg:sticky lg:top-4">
        <ContactPanel />
      </div>
    </div>
  );
};

export default RealEstateAdPage;