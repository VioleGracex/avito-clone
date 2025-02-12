import React from 'react';
import { RealEstateAd } from '../../types/Ad';

interface RealEstateFormProps {
  formData: RealEstateAd;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const RealEstateForm: React.FC<RealEstateFormProps> = ({ formData, handleChange }) => {
  return (
    <>
      <div className="mb-4">
        <label className="block text-gray-700">Тип недвижимости</label>
        <input type="text" name="propertyType" value={formData.propertyType} onChange={handleChange} required className="w-full p-2 border rounded-md" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Площадь</label>
        <input type="number" name="area" value={formData.area} onChange={handleChange} required className="w-full p-2 border rounded-md" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Комнаты</label>
        <input type="number" name="rooms" value={formData.rooms} onChange={handleChange} required className="w-full p-2 border rounded-md" />
      </div>
    </>
  );
};

export default RealEstateForm;