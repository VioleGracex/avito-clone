import axios from 'axios';
import { Ad } from '../types/Ad';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getAds = async (): Promise<Ad[]> => {
  const response = await axios.get(`${API_URL}/items`);
  return response.data;
};

export const getAdById = async (id: string): Promise<Ad> => {
  const response = await axios.get(`${API_URL}/items/${id}`);
  return response.data;
};

export const createAd = async (ad: Ad): Promise<Ad> => {
  const response = await axios.post(`${API_URL}/items`, ad);
  return response.data;
};

export const updateAd = async (id: string, ad: Ad): Promise<Ad> => {
  const response = await axios.put(`${API_URL}/items/${id}`, ad);
  return response.data;
};

export const deleteAdById = async (id: string): Promise<number> => {
  const response = await axios.delete(`${API_URL}/items/${id}`);
  return response.status; 
};

export const getUserAds = async (userId: string): Promise<{ ads: Ad[], message?: string }> => {
  const response = await axios.get(`${API_URL}/items/user/${userId}`);
  return response.data;
};