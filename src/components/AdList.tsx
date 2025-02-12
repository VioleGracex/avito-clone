import React, { useState, useEffect } from 'react';
import { getAds } from '../services/api';
import { Ad, ServicesAd } from '../types/Ad';
import AdCard from './AdCard';
import FilterPopup from './FilterPopup';
import { FaFilter, FaTh, FaBars, FaCoins } from 'react-icons/fa';
import { filterTypes, serviceTypes } from '../constants/filterData';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const AdList: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '0', max: '10000' });
  const [showFilter, setShowFilter] = useState(false);
  const [viewType, setViewType] = useState<'column' | 'grid'>('column');
  const [usePriceLimit, setUsePriceLimit] = useState(true);

  useEffect(() => {
    getAds().then((data) => setAds([...data]));
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const handleServiceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setServiceType(e.target.value);
  };

  const handlePriceChange = (name: string, value: string) => {
    setPriceRange((prev) => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setPriceRange({ min: String(value[0]), max: String(value[1]) });
    }
  };

  const handleUsePriceLimitChange = () => {
    setUsePriceLimit(!usePriceLimit);
  };

  const handleReset = () => {
    setSearch('');
    setFilter('');
    setServiceType('');
    setPriceRange({ min: '0', max: '10000' });
    setUsePriceLimit(true);
  };

  const handleApply = () => {
    setShowFilter(false);
  };

  const filteredAds = ads.filter((ad) => {
    return (
      ad.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter ? ad.type === filter : true) &&
      (serviceType ? (ad as ServicesAd).serviceType === serviceType : true) &&
      (!usePriceLimit || (priceRange.min ? ad.price >= Number(priceRange.min) : true)) &&
      (!usePriceLimit || (priceRange.max ? ad.price <= Number(priceRange.max) : true))
    );
  });

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4 justify-center" style={{ maxWidth: '1440px' }}>
      <div className="flex justify-between items-center w-full mb-4 lg:mb-0">
        <button
          className="lg:hidden bg-blue-500 text-white p-2 rounded-full"
          onClick={() => setShowFilter(true)}
        >
          <FaFilter />
        </button>
        {/* Контейнер для кнопок вида */}
        <div className="flex space-x-2 ml-auto">
          <button onClick={() => setViewType('column')} className={`p-2 ${viewType === 'column' ? 'bg-gray-200' : ''}`}>
            <FaBars />
          </button>
          <button onClick={() => setViewType('grid')} className={`p-2 ${viewType === 'grid' ? 'bg-gray-200' : ''}`}>
            <FaTh />
          </button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row lg:space-x-2">
        <div className={`w-full lg:w-1/4 space-y-4 ${showFilter ? 'block' : 'hidden'} lg:block p-4 rounded-md`} style={{ maxWidth: '244px' }}>
          <input
            type="text"
            placeholder="Поиск..."
            value={search}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded-md"
          />
          <select value={filter} onChange={handleFilterChange} className="w-full p-2 border rounded-md">
            {filterTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <select value={serviceType} onChange={handleServiceTypeChange} className="w-full p-2 border rounded-md">
            {serviceTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={usePriceLimit}
              onChange={handleUsePriceLimitChange}
            />
            <label>Использовать ограничение по цене</label>
          </div>
          {usePriceLimit && (
            <div className="flex flex-col space-y-4">
              <Slider
                range
                min={0}
                max={10000}
                value={[Number(priceRange.min), Number(priceRange.max)]}
                onChange={handleSliderChange}
              />
              <div className="flex flex-col space-y-4">
                <div className="relative w-full">
                  <FaCoins className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    name="min"
                    placeholder="Мин. цена"
                    value={priceRange.min}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-md"
                  />
                </div>
                <div className="relative w-full">
                  <FaCoins className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    name="max"
                    placeholder="Макс. цена"
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-md"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="w-full lg:w-3/4 flex">
          <ul className={`grid ${viewType === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-24 xl:gap-24' : 'grid-cols-1 gap-6'}`}>
            {filteredAds.map((ad) => (
              <li key={ad.slug}>
                <AdCard ad={ad} viewType={viewType} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <FilterPopup
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
        search={search}
        filter={filter}
        serviceType={serviceType}
        priceRange={priceRange}
        usePriceLimit={usePriceLimit}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onServiceTypeChange={handleServiceTypeChange}
        onPriceChange={handlePriceChange}
        onUsePriceLimitChange={handleUsePriceLimitChange}
        onReset={handleReset}
        onApply={handleApply}
      />
    </div>
  );
};

export default AdList;