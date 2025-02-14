import React, { useEffect } from 'react';
import { Ad, RealEstateAd, AutoAd, ServicesAd } from '../types/Ad';
import RealEstateForm from './forms/AdForms/RealEstateForm';
import AutoForm from './forms/AdForms/AutoForm';
import ServicesForm from './forms/AdForms/ServicesForm';
import ImageUpload from '../components/ImageUpload';

interface AdFormStepsProps {
  step: number;
  setStep: (step: number) => void;
  formData: Ad;
  setFormData: React.Dispatch<React.SetStateAction<Ad>>;
  errors: { [key: string]: string | null };
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string | null }>>;
  handleSaveDraft: () => void;
}

const AdFormSteps: React.FC<AdFormStepsProps> = ({ step, setStep, formData, setFormData, errors, setErrors, handleSaveDraft }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      updatedAt: new Date(), // Update the updatedAt timestamp
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: null,
    }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    let updatedFormData: Ad | RealEstateAd | AutoAd | ServicesAd;

    switch (value) {
      case 'Недвижимость':
        updatedFormData = { ...formData, type: 'Недвижимость' } as RealEstateAd;
        break;
      case 'Авто':
        updatedFormData = { ...formData, type: 'Авто' } as AutoAd;
        break;
      case 'Услуги':
        updatedFormData = { ...formData, type: 'Услуги' } as ServicesAd;
        break;
      default:
        updatedFormData = { ...formData, type: 'Недвижимость' } as RealEstateAd;
        break;
    }

    setFormData(updatedFormData);
    setErrors({});
  };

  const handleImageChange = (images: string[]) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      images,
      updatedAt: new Date(), // Update the updatedAt timestamp
    }));
  };

  useEffect(() => {
    handleSaveDraft();
  }, [formData, handleSaveDraft]);

  const validateStep1 = () => {
    let isValid = true;
    const newErrors: { [key: string]: string | null } = {};

    if (!formData.name) {
      isValid = false;
      newErrors.name = 'Название обязательно';
    }

    if (!formData.description) {
      isValid = false;
      newErrors.description = 'Описание обязательно';
    }

    if (!formData.location) {
      isValid = false;
      newErrors.location = 'Местоположение обязательно';
    }

    if (!formData.type) {
      isValid = false;
      newErrors.type = 'Категория обязательна';
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <>
      {step === 1 && (
        <div>
          <div className="mb-4">
            <label className="block text-gray-700">Название</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Описание</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
            {errors.description && <p className="text-red-500">{errors.description}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Местоположение</label>
            <input
              type="text"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
            {errors.location && <p className="text-red-500">{errors.location}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Категория объявления</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleTypeChange}
              required
              className="w-full p-2 border rounded-md"
            >
              <option value="">Выберите категорию</option>
              <option value="Недвижимость">Недвижимость</option>
              <option value="Авто">Авто</option>
              <option value="Услуги">Услуги</option>
            </select>
            {errors.type && <p className="text-red-500">{errors.type}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Изображения</label>
            <ImageUpload images={formData.images || []} onImagesChange={handleImageChange} />
          </div>
          <button type="button" onClick={handleNext} className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 cursor-pointer">
            Далее
          </button>
        </div>
      )}
      {step === 2 && (
        <div>
          {formData.type === 'Недвижимость' && (
            <RealEstateForm formData={formData as RealEstateAd} handleChange={handleChange} errors={errors} />
          )}
          {formData.type === 'Авто' && (
            <AutoForm formData={formData as AutoAd} handleChange={handleChange} errors={errors} />
          )}
          {formData.type === 'Услуги' && (
            <ServicesForm formData={formData as ServicesAd} handleChange={handleChange} errors={errors} />
          )}
          <button type="button" onClick={handleBack} className="bg-gray-500 text-white p-2 rounded-md mr-2 hover:bg-gray-600 cursor-pointer">
            Назад
          </button>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 cursor-pointer">
            {formData.id ? 'Обновить объявление' : 'Создать объявление'}
          </button>
        </div>
      )}
    </>
  );
};

export default AdFormSteps;