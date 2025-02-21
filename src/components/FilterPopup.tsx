import React from 'react';
import { filterTypes, serviceTypes } from '../constants/filterData';
import { FaTimes, FaSearch, FaFilter, FaCoins } from 'react-icons/fa';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { motion } from 'framer-motion';

interface FilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  search: string;
  filter: string;
  serviceType: string;
  priceRange: { min: string; max: string };
  usePriceLimit: boolean;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onServiceTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPriceChange: (name: string, value: string) => void;
  onUsePriceLimitChange: () => void;
  onReset: () => void;
  onApply: () => void;
}

const FilterPopup: React.FC<FilterPopupProps> = ({
  isOpen,
  onClose,
  search,
  filter,
  serviceType,
  priceRange,
  usePriceLimit,
  onSearchChange,
  onFilterChange,
  onServiceTypeChange,
  onPriceChange,
  onUsePriceLimitChange,
  onReset,
  onApply
}) => {
  
  const variants = {
    open: { y: 0, opacity: 1 },
    closed: { y: '100%', opacity: 0 },
  };

  const handleSliderChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      onPriceChange('min', String(value[0]));
      onPriceChange('max', String(value[1]));
    }
  };

  return (
    <motion.div 
      initial="closed" 
      animate={isOpen ? "open" : "closed"} 
      variants={variants} 
      transition={{ duration: 0.3 }} 
      className={`fixed top-0 left-0 right-0 h-full z-50 bg-white shadow-md`}
    >
      <div className="p-6 w-full max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Фильтр</h2>
          <button className="text-gray-500 text-3xl" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="mb-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск..."
              value={search}
              onChange={onSearchChange}
              className="w-full pl-10 pr-4 py-3 border rounded-md"
            />
          </div>
        </div>
        <div className="mb-4">
          <div className="relative">
            <FaFilter className="absolute left-3 top-3 text-gray-400" />
            <select value={filter} onChange={onFilterChange} className="w-full pl-10 pr-4 py-3 border rounded-md">
              {filterTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <div className="relative">
            <FaFilter className="absolute left-3 top-3 text-gray-400" />
            <select value={serviceType} onChange={onServiceTypeChange} className="w-full pl-10 pr-4 py-3 border rounded-md">
              {serviceTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={usePriceLimit}
              onChange={onUsePriceLimitChange}
            />
            <label>Использовать ограничение по цене</label>
          </div>
          {usePriceLimit && (
            <>
              <label className="block mb-2 text-gray-700">Ценовой диапазон</label>
              <Slider
                range
                min={0}
                max={10000}
                value={[Number(priceRange.min), Number(priceRange.max)]}
                onChange={handleSliderChange}
                className="mb-4"
              />
              <div className="flex flex-col space-y-4">
                <div className="relative w-full">
                  <FaCoins className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    name="min"
                    placeholder="Мин. цена"
                    value={priceRange.min}
                    onChange={(e) => onPriceChange('min', e.target.value)}
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
                    onChange={(e) => onPriceChange('max', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border rounded-md"
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex justify-between items-center mt-4 space-x-2">
          <button className="w-full bg-gray-500 text-white py-3 px-4 rounded-md" onClick={onReset}>
            Сбросить
          </button>
          <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-md" onClick={onApply}>
            Показать
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterPopup;