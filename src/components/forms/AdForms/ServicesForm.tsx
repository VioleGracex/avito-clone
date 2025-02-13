import React from 'react';
import { ServicesAd } from '../../../types/Ad';

interface ServicesFormProps {
  formData: ServicesAd;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  errors: { [key: string]: string | null };
}

const ServicesForm: React.FC<ServicesFormProps> = ({ formData, handleChange, errors }) => {
  return (
    <>
      <div className="mb-4">
        <label className="block text-gray-700">Тип услуги</label>
        <input
          type="text"
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md"
        />
        {errors.serviceType && <p className="text-red-500">{errors.serviceType}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Опыт (в годах)</label>
        <input
          type="number"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md"
          min="1"
        />
        {errors.experience && <p className="text-red-500">{errors.experience}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Стоимость</label>
        <input
          type="number"
          name="cost"
          value={formData.cost}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md"
          min="1"
        />
        {errors.cost && <p className="text-red-500">{errors.cost}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Цена за услугу</label>
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

export default ServicesForm;