import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Ad, RealEstateAd, AutoAd, ServicesAd } from '../types/Ad';
import RealEstateAdPage from '../components/adPages/RealEstateAdPage';
import AutoAdPage from '../components/adPages/AutoAdPage';
import ServicesAdPage from '../components/adPages/ServicesAdPage';
import { getAdById } from '../services/api';

const AdPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ad, setAd] = useState<Ad | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const data = await getAdById(id as string);
        setAd(data);
      } catch (err) {
        setError('Error fetching ad');
        console.error('Error fetching ad:', err);
      }
    };

    fetchAd();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!ad) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      {ad.type === 'Недвижимость' && <RealEstateAdPage ad={ad as RealEstateAd} />}
      {ad.type === 'Авто' && <AutoAdPage ad={ad as AutoAd} />}
      {ad.type === 'Услуги' && <ServicesAdPage ad={ad as ServicesAd} />}
    </div>
  );
};

export default AdPage;