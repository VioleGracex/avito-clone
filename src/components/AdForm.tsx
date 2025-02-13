import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createAd, updateAd, getAdById } from '../services/api';
import { Ad, RealEstateAd, AutoAd, ServicesAd, initialRealEstateAd, initialAutoAd, initialServicesAd } from '../types/Ad';
import RealEstateForm from './forms/AdForms/RealEstateForm';
import AutoForm from './forms/AdForms/AutoForm';
import ServicesForm from './forms/AdForms/ServicesForm';
import ImageUpload from '../components/ImageUpload';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import AuthPopup from './popups/AuthPopup';
import { checkIfLoggedIn } from '../services/auth';

const AdForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Ad | RealEstateAd | AutoAd | ServicesAd>(initialRealEstateAd);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authPopupOpen, setAuthPopupOpen] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await checkIfLoggedIn();
      setIsLoggedIn(loggedIn);
      setAuthPopupOpen(!loggedIn);
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (id && isLoggedIn) {
      getAdById(id)
        .then((ad) => {
          setFormData(ad);
          setErrors({});
        })
        .catch(() => {
          setErrors((prevErrors) => ({
            ...prevErrors,
            fetch: 'Ошибка загрузки объявления',
          }));
        });
    } else if (!id) {
      setFormData(initialRealEstateAd); // Set default initial state
    }
  }, [id, isLoggedIn]);

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
        updatedFormData = { ...initialRealEstateAd, ...formData, type: 'Недвижимость' } as RealEstateAd;
        break;
      case 'Авто':
        updatedFormData = { ...initialAutoAd, ...formData, type: 'Авто' } as AutoAd;
        break;
      case 'Услуги':
        updatedFormData = { ...initialServicesAd, ...formData, type: 'Услуги' } as ServicesAd;
        break;
      default:
        updatedFormData = { ...initialRealEstateAd, ...formData, type: 'Недвижимость' } as RealEstateAd;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      updateAd(id, formData)
        .then(() => navigate('/list'))
        .catch(() => {
          setErrors((prevErrors) => ({
            ...prevErrors,
            submit: 'Ошибка обновления объявления',
          }));
        });
    } else {
      createAd(formData)
        .then(() => navigate('/list'))
        .catch(() => {
          setErrors((prevErrors) => ({
            ...prevErrors,
            submit: 'Ошибка создания объявления',
          }));
        });
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setAuthPopupOpen(false);
    window.location.reload(); // Refresh the page to update the header
  };

  if (!isLoggedIn && authPopupOpen) {
    return <AuthPopup onClose={() => setAuthPopupOpen(false)} view="login" onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-md max-w-2xl mx-auto mt-15">
      <nav className="flex items-center space-x-2 text-gray-700 mb-4">
        <Link to="/" className="hover:underline">Главная</Link>
        <ChevronRightIcon className="w-5 h-5" />
        <Link to="/list" className="hover:underline">Объявления</Link>
        <ChevronRightIcon className="w-5 h-5" />
        <Link to={id ? `/form/${id}` : '/form'} className="hover:underline">{id ? 'Редактировать объявление' : 'Создать объявление'}</Link>
        <ChevronRightIcon className="w-5 h-5" />
        {step === 1 ? (
          <span>Шаг 1</span>
        ) : (
          <Link to="#" onClick={() => setStep(1)} className="hover:underline">Шаг 1</Link>
        )}
        {step === 2 && (
          <>
            <ChevronRightIcon className="w-5 h-5" />
            <span>Шаг 2</span>
          </>
        )}
      </nav>
      <h2 className="text-2xl font-bold mb-4">{id ? 'Редактировать объявление' : 'Создать объявление'}</h2>
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700">Название</label>
              <input
                type="text"
                name="name"
                value={formData.name}
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
                value={formData.description}
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
                value={formData.location}
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
            <button type="button" onClick={handleNext} className="bg-blue-500 text-white p-2 rounded-md hover:cursor-pointer">
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
            <button type="button" onClick={handleBack} className="bg-gray-500 text-white p-2 rounded-md mr-2 hover:cursor-pointer">
              Назад
            </button>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:cursor-pointer">
              {id ? 'Обновить объявление' : 'Создать объявление'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AdForm;