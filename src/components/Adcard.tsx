import React, { useState, useEffect } from 'react';
import { Ad } from '../types/Ad';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaMapMarkerAlt, FaTag, FaCoins } from 'react-icons/fa';

interface AdCardProps {
  ad: Ad;
  viewType: 'column' | 'grid';
}

// Main AdCard component that switches between grid and column views
const AdCard: React.FC<AdCardProps> = ({ ad, viewType }) => {
  return viewType === 'grid' ? <GridAdCard ad={ad} /> : <ColumnAdCard ad={ad} />;
};

// Grid view of the AdCard
const GridAdCard: React.FC<{ ad: Ad }> = ({ ad }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (ad.images && ad.images.length > 0 && isHovered) {
      const images = ad.images ?? [];
      const imageSwitchInterval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000);
      return () => clearInterval(imageSwitchInterval);
    }
  }, [ad.images, isHovered]);

  const handleClick = () => {
    navigate(`/item/${ad.slug}`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleCircleClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div
      className="relative p-4 m-2 bg-white shadow-md rounded-md flex-col items-center"
      style={{ height: '320px', maxWidth: 'calc(100% - 20px)', width: '280px' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image section */}
      {ad.images && ad.images.length > 0 ? (
        <div className="relative w-full h-36 mb-4">
          <img
            src={ad.images[currentImageIndex]}
            alt={ad.name}
            className="rounded-md cursor-pointer w-full h-full object-cover"
            onClick={handleClick}
          />
          <div className="absolute bottom-0 left-0 w-full flex justify-center space-x-1 p-1 bg-black bg-opacity-50 rounded-b-md">
            {ad.images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-gray-400'}`}
                onClick={() => handleCircleClick(index)}
              ></div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="bg-gray-200 rounded-md flex items-center justify-center cursor-pointer w-full h-36 mb-4"
          onClick={handleClick}
        >
          <span className="text-gray-500">Нет изображения</span>
        </div>
      )}

      {/* Details section */}
      <div className="flex-1 flex flex-col text-left">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-[#222222] cursor-pointer" onClick={handleClick}>
            {ad.name && (ad.name.length > 20 ? `${ad.name.substring(0, 20)}...` : ad.name)}
          </h3>
          <button className="text-gray-300">
            <FaHeart />
          </button>
        </div>
        <p className="text-md text-[#555555] flex items-center mt-2">
          <FaCoins className="mr-1" /> {ad.price}
        </p>
        <p className="text-md text-[#555555] flex items-center mt-2">
          <FaTag className="mr-1" /> {ad.type}
        </p>
        {ad.location && (
          <p className="text-md text-[#444444] flex items-center mt-2">
            <FaMapMarkerAlt className="mr-1" /> {ad.location}
          </p>
        )}
      </div>
    </div>
  );
};

// Column view of the AdCard
const ColumnAdCard: React.FC<{ ad: Ad }> = ({ ad }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (ad.images && ad.images.length > 0 && isHovered) {
      const images = ad.images ?? [];
      const imageSwitchInterval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000);
      return () => clearInterval(imageSwitchInterval);
    }
  }, [ad.images, isHovered]);

  const handleClick = () => {
    navigate(`/item/${ad.slug}`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleCircleClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div
      className="relative p-4 bg-white shadow-md rounded-md flex items-center"
      style={{ height: '352px', maxWidth: 'calc(100% - 20px)', width: '800px' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image section */}
      {ad.images && ad.images.length > 0 ? (
        <div className="relative w-64 h-64">
          <img
            src={ad.images[currentImageIndex]}
            alt={ad.name}
            className="rounded-md cursor-pointer w-full h-full object-cover"
            onClick={handleClick}
          />
          <div className="absolute bottom-0 left-0 w-full flex justify-center space-x-1 p-1 bg-black bg-opacity-50 rounded-b-md">
            {ad.images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-gray-400'}`}
                onClick={() => handleCircleClick(index)}
              ></div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="bg-gray-200 rounded-md flex items-center justify-center cursor-pointer w-64 h-64"
          onClick={handleClick}
        >
          <span className="text-gray-500">Нет изображения</span>
        </div>
      )}

      {/* Details section */}
      <div className="flex-1 flex flex-col translate-y-[-40px] ml-4">
        <h3 className="text-2xl font-bold text-[#222222] cursor-pointer mb-2 mt-0" onClick={handleClick}>
          {ad.name && (ad.name.length > 20 ? `${ad.name.substring(0, 20)}...` : ad.name)}
        </h3>
        <p className="text-lg text-[#333333] mb-2">
          {ad.description && (ad.description.length > 50 ? `${ad.description.substring(0, 50)}...` : ad.description)}
        </p>
        <p className="text-lg text-[#555555] flex items-center mb-2">
          <FaCoins className="mr-1" /> {ad.price}
        </p>
        <p className="text-lg text-[#555555] flex items-center mb-2">
          <FaTag className="mr-1" /> {ad.type}
        </p>
        {ad.location && (
          <p className="text-lg text-[#444444] flex items-center">
            <FaMapMarkerAlt className="mr-1" /> {ad.location}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdCard;