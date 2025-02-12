import React from 'react';
import { AutoAd } from '../../types/Ad';

interface AutoFormProps {
  formData: AutoAd;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  errors: { [key: string]: string | null };
}

const AutoForm: React.FC<AutoFormProps> = ({ formData, handleChange, errors }) => {
  return (
    <>
      <div className="mb-4">
        <label className="block text-gray-700">Марка</label>
        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md"
        />
        {errors.brand && <p className="text-red-500">{errors.brand}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Модель</label>
        <input
          type="text"
          name="model"
          value={formData.model}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md"
        />
        {errors.model && <p className="text-red-500">{errors.model}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Год</label>
        <input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md"
          min="1886"
          max={new Date().getFullYear()}
        />
        {errors.year && <p className="text-red-500">{errors.year}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Пробег</label>
        <input
          type="number"
          name="mileage"
          value={formData.mileage}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          min="1"
        />
        {errors.mileage && <p className="text-red-500">{errors.mileage}</p>}
      </div>
    </>
  );
};

export default AutoForm;