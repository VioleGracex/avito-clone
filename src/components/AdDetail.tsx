import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAdBySlug } from '../services/api';
import { Ad } from '../types/Ad';

const AdDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {
    if (slug) {
      getAdBySlug(slug).then((data) => {
        setAd(data);
      });
    }
  }, [slug]);

  if (!ad) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-4 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">{ad.name}</h2>
      <p className="text-gray-700 mb-2">{ad.description}</p>
      <p className="text-gray-700 mb-2">{ad.location}</p>
      {ad.type === 'Недвижимость' && (
        <>
          <p className="text-gray-700 mb-2">Property Type: {ad.propertyType}</p>
          <p className="text-gray-700 mb-2">Area: {ad.area} sqm</p>
          <p className="text-gray-700 mb-2">Rooms: {ad.rooms}</p>
          <p className="text-gray-700 mb-2">Price: ${ad.price}</p>
        </>
      )}
      {ad.type === 'Авто' && (
        <>
          <p className="text-gray-700 mb-2">Brand: {ad.brand}</p>
          <p className="text-gray-700 mb-2">Model: {ad.model}</p>
          <p className="text-gray-700 mb-2">Year: {ad.year}</p>
          <p className="text-gray-700 mb-2">Mileage: {ad.mileage} km</p>
        </>
      )}
      {ad.type === 'Услуги' && (
        <>
          <p className="text-gray-700 mb-2">Service Type: {ad.serviceType}</p>
          <p className="text-gray-700 mb-2">Experience: {ad.experience} years</p>
          <p className="text-gray-700 mb-2">Cost: ${ad.cost}</p>
        </>
      )}
    </div>
  );
};

export default AdDetail;