export interface BaseAd {
  id?: number;
  name: string;
  description: string;
  location: string;
  type: string;
  price: number;
  imageUrl?: string;
  images?: string[]; // Up to 5 images
  createdAt: Date;
  updatedAt: Date;
  userId: string;  // Changed userId to string
}

export interface RealEstateAd extends BaseAd {
  type: 'Недвижимость';
  propertyType: string;
  area: number;
  rooms: number;
  bathroom?: string;
  furniture?: string;
  appliances?: string;
  internetAndTv?: string;
  deposit?: number;
  commission?: number;
  meterPay?: string;
  otherUtilities?: string;
  childrenAllowed?: boolean;
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
}

export interface AutoAd extends BaseAd {
  type: 'Авто';
  brand: string;
  model: string;
  year: number;
  mileage: number;
  generation?: string;
  mileageHistory?: string;
  pts?: string;
  owners?: number;
  condition?: string;
  modification?: string;
  engineVolume?: number;
  engineType?: string;
  transmission?: string;
  driveType?: string;
  configuration?: string;
  bodyType?: string;
  color?: string;
  steeringWheel?: string;
  vin?: string;
  exchange?: boolean;
}

export interface ServicesAd extends BaseAd {
  type: 'Услуги';
  serviceType: string;
  experience: number;
  cost: number;
}

export type Ad = RealEstateAd | AutoAd | ServicesAd;

// Initial values for different ad types
export const initialRealEstateAd: RealEstateAd = {
  name: '',
  description: '',
  location: '',
  type: 'Недвижимость',
  price: 0,
  images: [],
  propertyType: '',
  area: 0,
  rooms: 0,
  bathroom: '',
  furniture: '',
  appliances: '',
  internetAndTv: '',
  deposit: 0,
  commission: 0,
  meterPay: '',
  otherUtilities: '',
  childrenAllowed: false,
  petsAllowed: false,
  smokingAllowed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: '',  // Changed userId to string
};

export const initialAutoAd: AutoAd = {
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
  generation: '',
  mileageHistory: '',
  pts: '',
  owners: 0,
  condition: '',
  modification: '',
  engineVolume: 0,
  engineType: '',
  transmission: '',
  driveType: '',
  configuration: '',
  bodyType: '',
  color: '',
  steeringWheel: '',
  vin: '',
  exchange: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: '',  // Changed userId to string
};

export const initialServicesAd: ServicesAd = {
  name: '',
  description: '',
  location: '',
  type: 'Услуги',
  price: 0,
  images: [],
  serviceType: '',
  experience: 0,
  cost: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: '',  // Changed userId to string
};