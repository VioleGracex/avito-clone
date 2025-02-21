import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAds } from '../services/api';
import { Ad, ServicesAd } from '../types/Ad';
import AdCard from './AdCard';
import FilterPopup from './FilterPopup';
import AdPagination from './AdPagination';
import { FaFilter, FaTh, FaBars, FaCoins, FaSortUp, FaSortDown } from 'react-icons/fa';
import { filterTypes, serviceTypes } from '../constants/filterData';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const AdList: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '0', max: '10000' });
  const [showFilter, setShowFilter] = useState(false);
  const [viewType, setViewType] = useState<'column' | 'grid'>('column');
  const [usePriceLimit, setUsePriceLimit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [adsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');

  useEffect(() => {
    getAds().then((data) => {
      setAds([...data]);
      setLoading(false); // Set loading to false once ads are fetched
    });
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

  const handleSortOrderChange = () => {
    setSortOrder((prevOrder) => (prevOrder === 'recent' ? 'oldest' : 'recent'));
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const filteredAds = ads
    .filter((ad) => {
      return (
        ad.name.toLowerCase().includes(search.toLowerCase()) &&
        (filter ? ad.type === filter : true) &&
        (serviceType ? (ad as ServicesAd).serviceType === serviceType : true) &&
        (!usePriceLimit || (priceRange.min ? ad.price >= Number(priceRange.min) : true)) &&
        (!usePriceLimit || (priceRange.max ? ad.price <= Number(priceRange.max) : true))
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      if (sortOrder === 'recent') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

  const indexOfLastAd = currentPage * adsPerPage;
  const indexOfFirstAd = indexOfLastAd - adsPerPage;
  const currentAds = filteredAds.slice(indexOfFirstAd, indexOfLastAd);

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4 justify-center" style={{ maxWidth: '1440px' }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="flex justify-between items-center w-full mb-4 lg:mb-0">
        <button
          className="lg:hidden bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 cursor-pointer"
          onClick={() => setShowFilter(true)}
        >
          <FaFilter />
        </button>
        {/* Контейнер для кнопок вида и сортировки */}
        <div className="flex space-x-2 ml-auto">
          <button onClick={handleSortOrderChange} className="p-2 hover:bg-gray-300 cursor-pointer flex items-center">
            {sortOrder === 'recent' ? <FaSortUp /> : <FaSortDown />}
            <span className="ml-2">{sortOrder === 'recent' ? 'Сначала новые' : 'Сначала старые'}</span>
          </button>
          <button onClick={() => setViewType('column')} className={`p-2 ${viewType === 'column' ? 'bg-gray-200' : ''} hover:bg-gray-300 cursor-pointer`}>
            <FaBars />
          </button>
          <button onClick={() => setViewType('grid')} className={`p-2 ${viewType === 'grid' ? 'bg-gray-200' : ''} hover:bg-gray-300 cursor-pointer`}>
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
          <select value={filter} onChange={handleFilterChange} className="w-full p-2 border rounded-md cursor-pointer">
            {filterTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <select value={serviceType} onChange={handleServiceTypeChange} className="w-full p-2 border rounded-md cursor-pointer">
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
              className="cursor-pointer"
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
          <div className="flex justify-between items-center mt-4 space-x-2">
            <button className="w-full bg-gray-500 text-white py-3 px-4 rounded-md hover:bg-gray-600 cursor-pointer" onClick={handleReset}>
              Сбросить
            </button>
            <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 cursor-pointer" onClick={handleApply}>
              Показать
            </button>
          </div>
        </div>
        <div className="w-full lg:w-3/4 flex flex-col items-center">
          {currentAds.length > 0 ? (
            <ul className={`grid ${viewType === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  xl:gap-4' : 'grid-cols-1 gap-6'}`}>
              {currentAds.map((ad) => (
                <li key={ad.id}>
                  <AdCard ad={ad} viewType={viewType} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center">
              <p>{search || filter || serviceType || usePriceLimit ? 'Объявления с такими параметрами не найдены.' : 'Здесь пока нет объявлений. Будьте первым, кто воспользуется нашими услугами.'}</p>
              <Link to="/form" className="mt-4 bg-blue-500 text-white p-2 rounded-md inline-block hover:bg-blue-600 cursor-pointer">
                + Разместить объявление
              </Link>
            </div>
          )}
        </div>
      </div>
      <AdPagination
        adsPerPage={adsPerPage}
        totalAds={filteredAds.length}
        paginate={paginate}
        currentPage={currentPage}
      />
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