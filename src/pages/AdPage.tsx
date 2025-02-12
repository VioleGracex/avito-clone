import React from 'react';
import { useParams } from 'react-router-dom';
import { Ad } from '../types/Ad';

const defaultImage = 'https://via.placeholder.com/824x352';

const AdPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [ad, setAd] = React.useState<Ad | null>(null);

  React.useEffect(() => {
    // Fetch the ad by slug from the API
    const fetchAd = async () => {
      const response = await fetch(`/api/ads/${slug}`);
      const data = await response.json();
      setAd(data);
    };

    fetchAd();
  }, [slug]);

  if (!ad) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/3">
        <img src={ad.imageUrl || defaultImage} alt={ad.name} className="w-full h-96 object-cover rounded-md" />
      </div>
      <div className="flex-1 space-y-4">
        <h2 className="text-3xl font-bold text-[#222222]">{ad.name}</h2>
        <p className="text-xl text-[#333333]">Price: {ad.price}</p>
        <p className="text-lg text-[#444444]">{ad.description}</p>
        <p className="text-lg text-[#555555]">Location: {ad.location}</p>
        <button className="mt-4 w-full bg-[#007acc] text-white p-2 rounded-md">Add to Favorites</button>
      </div>
    </div>
  );
};

export default AdPage;