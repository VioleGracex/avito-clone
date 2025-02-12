import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createAd, updateAd, getAdBySlug } from '../services/api';
import { Ad, RealEstateAd, AutoAd, ServicesAd } from '../types/Ad';
import { Tab } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import RealEstateForm from './forms/RealEstateForm';
import AutoForm from './forms/AutoForm';
import ServicesForm from './forms/ServicesForm';
import ImageUpload from './ImageUpload';

const initialRealEstateAd: RealEstateAd = {
  slug: '',
  name: '',
  description: '',
  location: '',
  type: 'Недвижимость',
  price: 0,
  images: [],
  propertyType: '',
  area: 0,
  rooms: 0,
};

const initialAutoAd: AutoAd = {
  slug: '',
  name: '',
  description: '',
  location: '',
  type: 'Авто',
  price: 0,
  images: [],
  brand: '',
  model: '',
  year: 0,
  mileage: 0,
};

const initialServicesAd: ServicesAd = {
  slug: '',
  name: '',
  description: '',
  location: '',
  type: 'Услуги',
  price: 0,
  images: [],
  serviceType: '',
  experience: 0,
  cost: 0,
};

const AdForm: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Ad>(initialRealEstateAd);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  // Fetch ad data if editing an existing ad
  useEffect(() => {
    if (slug) {
      getAdBySlug(slug)
        .then((ad) => {
          setFormData(ad);
          setErrors({});
        })
        .catch(() => {
          setErrors({ ...errors, fetch: 'Ошибка загрузки объявления' });
        });
    }
  }, [slug]);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Validate and prevent invalid values
    switch (name) {
      case 'price':
      case 'area':
      case 'rooms':
      case 'year':
      case 'mileage':
      case 'experience':
      case 'cost':
        if (parseFloat(value) < 1) {
          setErrors({ ...errors, [name]: 'Значение должно быть больше 0' });
          return;
        }
        break;
      case 'name':
      case 'description':
      case 'location':
      case 'propertyType':
      case 'brand':
      case 'model':
      case 'serviceType':
        if (value.trim() === '') {
          setErrors({ ...errors, [name]: 'Поле не должно быть пустым' });
          return;
        }
        break;
      default:
        break;
    }

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: null });
  };

  // Handle image changes
  const handleImageChange = (images: string[]) => {
    setFormData({ ...formData, images });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (slug) {
      // Update existing ad
      updateAd(slug, formData)
        .then(() => navigate('/list'))
        .catch(() => {
          setErrors({ ...errors, submit: 'Ошибка обновления объявления' });
        });
    } else {
      // Create new ad
      createAd(formData)
        .then(() => navigate('/list'))
        .catch(() => {
          setErrors({ ...errors, submit: 'Ошибка создания объявления' });
        });
    }
  };

  // Reset form data when switching tabs
  const handleTabChange = (index: number) => {
    const types = [initialRealEstateAd, initialAutoAd, initialServicesAd];
    setFormData(types[index]);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md max-w-2xl mx-auto mt-15">
      <nav className="flex items-center space-x-2 text-gray-700 mb-4">
        <Link to="/" className="hover:underline">Главная</Link>
        <ChevronRightIcon className="w-5 h-5" />
        <Link to="/list" className="hover:underline">Объявления</Link>
        <ChevronRightIcon className="w-5 h-5" />
        <span>{slug ? 'Редактировать объявление' : 'Создать объявление'}</span>
      </nav>
      <h2 className="text-2xl font-bold mb-4">{slug ? 'Редактировать объявление' : 'Создать объявление'}</h2>
      <Tab.Group onChange={handleTabChange}>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-4">
          <Tab
            className={({ selected }) =>
              clsx(
                'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                selected
                  ? 'bg-white shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            Недвижимость
          </Tab>
          <Tab
            className={({ selected }) =>
              clsx(
                'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                selected
                  ? 'bg-white shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            Авто
          </Tab>
          <Tab
            className={({ selected }) =>
              clsx(
                'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                selected
                  ? 'bg-white shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            Услуги
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            {formData.type === 'Недвижимость' && (
              <RealEstateForm formData={formData as RealEstateAd} handleChange={handleChange} errors={errors} />
            )}
          </Tab.Panel>
          <Tab.Panel>
            {formData.type === 'Авто' && (
              <AutoForm formData={formData as AutoAd} handleChange={handleChange} errors={errors} />
            )}
          </Tab.Panel>
          <Tab.Panel>
            {formData.type === 'Услуги' && (
              <ServicesForm formData={formData as ServicesAd} handleChange={handleChange} errors={errors} />
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      <form onSubmit={handleSubmit}>
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
          <input
            type="text"
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
          <label className="block text-gray-700">Цена</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
            pattern="^\d+(\.\d{1,2})?$"
          />
          {errors.price && <p className="text-red-500">{errors.price}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Изображения</label>
          <ImageUpload images={formData.images || []} onImagesChange={handleImageChange} />
        </div>
        {errors.submit && <p className="text-red-500">{errors.submit}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md">
          {slug ? 'Обновить объявление' : 'Создать объявление'}
        </button>
      </form>
    </div>
  );
};

export default AdForm;