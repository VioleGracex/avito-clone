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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      getAdBySlug(slug).then((ad) => {
        setFormData(ad);
        setError(null);
      });
    }
  }, [slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (images: string[]) => {
    setFormData({ ...formData, images });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (slug) {
      updateAd(slug, formData).then(() => navigate('/list'));
    } else {
      createAd(formData).then(() => navigate('/list'));
    }
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
      <Tab.Group
        onChange={(index) => {
          const types = [initialRealEstateAd, initialAutoAd, initialServicesAd];
          setFormData(types[index]);
        }}
      >
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
              <RealEstateForm formData={formData as RealEstateAd} handleChange={handleChange} />
            )}
          </Tab.Panel>
          <Tab.Panel>
            {formData.type === 'Авто' && (
              <AutoForm formData={formData as AutoAd} handleChange={handleChange} />
            )}
          </Tab.Panel>
          <Tab.Panel>
            {formData.type === 'Услуги' && (
              <ServicesForm formData={formData as ServicesAd} handleChange={handleChange} />
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
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Изображения</label>
          <ImageUpload images={formData.images || []} onImagesChange={handleImageChange} />
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md">Отправить</button>
      </form>
    </div>
  );
};

export default AdForm;