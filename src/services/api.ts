import axios from 'axios';
import { Ad } from '../types/Ad';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getAds = async (): Promise<Ad[]> => {
  const response = await axios.get(`${API_URL}/items`);
  return response.data;
};

export const getAdBySlug = async (slug: string): Promise<Ad> => {
  const response = await axios.get(`${API_URL}/items/${slug}`);
  return response.data;
};

export const createAd = async (ad: Ad): Promise<Ad> => {
  const response = await axios.post(`${API_URL}/items`, ad);
  return response.data;
};

export const updateAd = async (slug: string, ad: Ad): Promise<Ad> => {
  const response = await axios.put(`${API_URL}/items/${slug}`, ad);
  return response.data;
};

export const deleteAd = async (slug: string): Promise<number> => {
  const response = await axios.delete(`${API_URL}/items/${slug}`);
  return response.status;
};