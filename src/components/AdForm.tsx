import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createAd, updateAd, getAdBySlug } from '../services/api';
import { Ad, RealEstateAd, AutoAd, ServicesAd } from '../types/Ad';
import { ItemTypes } from '../utils/constants';

const AdForm: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Ad>({
    slug: '',
    name: '',
    description: '',
    location: '',
    type: ItemTypes.REAL_ESTATE,
  } as Ad);

  useEffect(() => {
    if (slug) {
      getAdBySlug(slug).then((ad) => {
        setFormData(ad);
      });
    }
  }, [slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (slug) {
      updateAd(slug, formData).then(() => navigate('/list'));
    } else {
      createAd(formData).then(() => navigate('/list'));
    }
  };

  const renderSpecificFields = () => {
    switch (formData.type) {
      case ItemTypes.REAL_ESTATE:
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700">Property Type</label>
              <input type="text" name="propertyType" value={(formData as RealEstateAd).propertyType || ''} onChange={handleChange} required className="w-full p-2 border rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Area</label>
              <input type="number" name="area" value={(formData as RealEstateAd).area || ''} onChange={handleChange} required className="w-full p-2 border rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Rooms</label>
              <input type="number" name="rooms" value={(formData as RealEstateAd).rooms || ''} onChange={handleChange} required className="w-full p-2 border rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Price</label>
              <input type="number" name="price" value={(formData as RealEstateAd).price || ''} onChange={handleChange} required className="w-full p-2 border rounded-md" />
            </div>
          </>
        );
      case ItemTypes.AUTO:
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700">Brand</label>
              <input type="text" name="brand" value={(formData as AutoAd).brand || ''} onChange={handleChange} required className="w-full p-2 border rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Model</label>
              <input type="text" name="model" value={(formData as AutoAd).model || ''} onChange={handleChange} required className="w-full p-2 border rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Year</label>
              <input type="number" name="year" value={(formData as AutoAd).year || ''} onChange={handleChange} required className="w-full p-2 border rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Mileage</label>
              <input type="number" name="mileage" value={(formData as AutoAd).mileage || ''} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
          </>
        );
      case ItemTypes.SERVICES:
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700">Service Type</label>
              <input type="text" name="serviceType" value={(formData as ServicesAd).serviceType || ''} onChange={handleChange} required className="w-full p-2 border rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Experience</label>
              <input type="number" name="experience" value={(formData as ServicesAd).experience || ''} onChange={handleChange} required className="w-full p-2 border rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Cost</label>
              <input type="number" name="cost" value={(formData as ServicesAd).cost || ''} onChange={handleChange} required className="w-full p-2 border rounded-md" />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-md max-w-2xl mx-auto mt-15">
      <h2 className="text-2xl font-bold mb-4">{slug ? 'Edit Ad' : 'Create Ad'}</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Title</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded-md" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Description</label>
        <input type="text" name="description" value={formData.description} onChange={handleChange} required className="w-full p-2 border rounded-md" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Location</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full p-2 border rounded-md" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Category</label>
        <select name="type" value={formData.type} onChange={handleChange} required className="w-full p-2 border rounded-md">
          <option value={ItemTypes.REAL_ESTATE}>Real Estate</option>
          <option value={ItemTypes.AUTO}>Auto</option>
          <option value={ItemTypes.SERVICES}>Services</option>
        </select>
      </div>

      {renderSpecificFields()}

      <button type="submit" className="w-full bg-violet-blue text-white p-2 rounded-md">Submit</button>
    </form>
  );
};

export default AdForm;