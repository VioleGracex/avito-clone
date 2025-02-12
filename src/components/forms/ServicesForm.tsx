import React from 'react';
import { ServicesAd } from '../../types/Ad';

interface ServicesFormProps {
  formData: ServicesAd;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const ServicesForm: React.FC<ServicesFormProps> = ({ formData, handleChange }) => {
  return (
    <>
      <div className="mb-4">
        <label className="block text-gray-700">Тип услуги</label>
        <input type="text" name="serviceType" value={formData.serviceType} onChange={handleChange} required className="w-full p-2 border rounded-md" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Опыт</label>
        <input type="number" name="experience" value={formData.experience} onChange={handleChange} required className="w-full p-2 border rounded-md" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Стоимость</label>
        <input type="number" name="cost" value={formData.cost} onChange={handleChange} required className="w-full p-2 border rounded-md" />
      </div>
    </>
  );
};

export default ServicesForm;