import React from 'react';
import { RealEstateAd } from '../../../types/Ad';

interface RealEstateFormProps {
  formData: RealEstateAd;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  errors: { [key: string]: string | null };
}

const RealEstateForm: React.FC<RealEstateFormProps> = ({ formData, handleChange, errors }) => {
  return (
    <>
      <div className="mb-4">
        <label className="block text-gray-700">Тип недвижимости</label>
        <input
          type="text"
          name="propertyType"
          value={formData.propertyType}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md"
        />
        {errors.propertyType && <p className="text-red-500">{errors.propertyType}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Площадь</label>
        <input
          type="number"
          name="area"
          value={formData.area}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md"
          min="1"
        />
        {errors.area && <p className="text-red-500">{errors.area}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Комнаты</label>
        <input
          type="number"
          name="rooms"
          value={formData.rooms}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md"
          min="1"
        />
        {errors.rooms && <p className="text-red-500">{errors.rooms}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Стоимость</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md"
          min="1"
        />
        {errors.price && <p className="text-red-500">{errors.price}</p>}
      </div>
    </>
  );
};

export default RealEstateForm;