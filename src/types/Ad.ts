export interface BaseAd {
  id?: number;
  slug: string;
  name: string;
  description: string;
  location: string;
  type: 'Недвижимость' | 'Авто' | 'Услуги';
  price: number;
  imageUrl?: string;
}

export interface RealEstateAd extends BaseAd {
  type: 'Недвижимость';
  propertyType: string;
  area: number;
  rooms: number;
}

export interface AutoAd extends BaseAd {
  type: 'Авто';
  brand: string;
  model: string;
  year: number;
  mileage: number;
}

export interface ServicesAd extends BaseAd {
  type: 'Услуги';
  serviceType: string;
  experience: number;
  cost: number;
}

export type Ad = RealEstateAd | AutoAd | ServicesAd;