import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserAds } from '../services/api';
import { Ad } from '../types/Ad';
import AdCard from '../components/AdCard';
import AdPagination from '../components/AdPagination';
import { FaTh, FaBars } from 'react-icons/fa';

const MyAdsPage: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [viewType, setViewType] = useState<'column' | 'grid'>('column');
  const [currentPage, setCurrentPage] = useState(1);
  const [adsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [noAdsMessage, setNoAdsMessage] = useState('');

  const userId = localStorage.getItem('userId') || ''; // Retrieve user ID from local storage

  useEffect(() => {
    const fetchUserAds = async () => {
      try {
        const data = await getUserAds(userId);
        if (data.ads.length === 0) {
          setNoAdsMessage(data.message || 'No ads were found');
        } else {
          setAds(data.ads);
        }
      } catch (err) {
        console.error('Не удалось загрузить объявления', err);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    if (userId) {
      fetchUserAds();
    }
  }, [userId]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const indexOfLastAd = currentPage * adsPerPage;
  const indexOfFirstAd = indexOfLastAd - adsPerPage;
  const currentAds = ads.slice(indexOfFirstAd, indexOfLastAd);

  if (loading) {
    return <div className="text-center p-4">Загрузка...</div>; // Show loading spinner or placeholder
  }

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4 justify-center" style={{ maxWidth: '1440px' }}>
      <div className="flex justify-between items-center w-full mb-4 lg:mb-0">
        <div className="flex space-x-2 ml-auto">
          <button onClick={() => setViewType('column')} className={`p-2 ${viewType === 'column' ? 'bg-gray-200' : ''}`}>
            <FaBars />
          </button>
          <button onClick={() => setViewType('grid')} className={`p-2 ${viewType === 'grid' ? 'bg-gray-200' : ''}`}>
            <FaTh />
          </button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row lg:space-x-2">
        <div className="w-full lg:w-3/4 flex flex-col items-center">
          {currentAds.length > 0 ? (
            <ul className={`grid ${viewType === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-4' : 'grid-cols-1 gap-6'}`}>
              {currentAds.map((ad) => (
                <li key={ad.id}>
                  <AdCard ad={ad} viewType={viewType} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center">
              <p>{noAdsMessage || 'У вас нет объявлений. Создайте своё первое объявление!'}</p>
              <Link to="/form" className="mt-4 bg-blue-500 text-white p-2 rounded-md inline-block">
                + Разместить объявление
              </Link>
            </div>
          )}
        </div>
      </div>
      <AdPagination
        adsPerPage={adsPerPage}
        totalAds={ads.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

export default MyAdsPage;