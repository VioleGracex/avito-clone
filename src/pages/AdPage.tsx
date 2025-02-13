import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Ad, RealEstateAd, AutoAd, ServicesAd } from '../types/Ad';
import RealEstateAdPage from '../components/adPages/RealEstateAdPage';
import AutoAdPage from '../components/adPages/AutoAdPage';
import ServicesAdPage from '../components/adPages/ServicesAdPage';
import { getAdById, deleteAdById } from '../services/api';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AdPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ad, setAd] = useState<Ad | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const data = await getAdById(id as string);
        setAd(data);
      } catch (err) {
        setError('Ошибка при получении объявления');
        console.error('Ошибка при получении объявления:', err);
      }
    };

    fetchAd();
  }, [id]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setCurrentUserId(userId);
  }, []);

  const handleDelete = async () => {
    try {
      await deleteAdById(id as string);
      navigate('/'); // Redirect to home page after deletion
    } catch (err) {
      setError('Ошибка при удалении объявления');
      console.error('Ошибка при удалении объявления:', err);
    }
  };

  const handleEdit = () => {
    navigate(`/form/${id}`); // Redirect to form page with id
  };

  if (error) return <p>{error}</p>;
  if (!ad) return <p>Загрузка...</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{ad.name}</h1>
        {currentUserId === ad.userId && (
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600 transition duration-300"
            >
              <FaEdit className="mr-2" /> Редактировать
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded flex items-center hover:bg-red-600 transition duration-300"
            >
              <FaTrash className="mr-2" /> Удалить
            </button>
          </div>
        )}
      </div>
      {ad.type === 'Недвижимость' && <RealEstateAdPage ad={ad as RealEstateAd} />}
      {ad.type === 'Авто' && <AutoAdPage ad={ad as AutoAd} />}
      {ad.type === 'Услуги' && <ServicesAdPage ad={ad as ServicesAd} />}
    </div>
  );
};

export default AdPage;