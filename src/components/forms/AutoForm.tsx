import React from 'react';
import { AutoAd } from '../../types/Ad';

interface AutoFormProps {
  formData: AutoAd;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const AutoForm: React.FC<AutoFormProps> = ({ formData, handleChange }) => {
  return (
    <>
      <div className="mb-4">
        <label className="block text-gray-700">Марка</label>
        <input type="text" name="brand" value={formData.brand} onChange={handleChange} required className="w-full p-2 border rounded-md" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Модель</label>
        <input type="text" name="model" value={formData.model} onChange={handleChange} required className="w-full p-2 border rounded-md" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Год</label>
        <input type="number" name="year" value={formData.year} onChange={handleChange} required className="w-full p-2 border rounded-md" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Пробег</label>
        <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} className="w-full p-2 border rounded-md" />
      </div>
    </>
  );
};

export default AutoForm;