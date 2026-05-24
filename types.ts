
export enum UserRole {
  DRIVER = 'DRIVER',
  PASSENGER = 'PASSENGER',
  CARGO_OWNER = 'CARGO_OWNER'
}

export type ProfileStatus = 'NONE' | 'PENDING' | 'VERIFIED' | 'SUSPENDED';

export interface Vehicle {
  id: string;
  model: string;
  plate: string;
  type: 'CAR' | 'VAN' | 'TEMPO' | 'TRUCK';
  rcNumber: string;
  insuranceNumber: string;
  fitnessExpiry: string;
  isPrimary: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  kycStatus?: ProfileStatus;
  companyName?: string; // For Cargo Owners
}

export interface Driver extends User {
  drivingLicense: string;
  vehicles: Vehicle[];
  rating: number;
  tripsCount: number;
  bio: string;
  joinedDate: string;
  verified: boolean;
}

export interface IntercityTrip {
  id: string;
  driverId: string;
  source: string;
  destination: string;
  date: string;
  timeWindow: string;
  vehicleId: string;
  utilityType: 'PASSENGER' | 'CARGO' | 'DUAL';
  capacity: {
    seats?: number;
    weightKg?: number;
  };
  stops: string[];
  flexibleRoute: boolean;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'MATCHED';
  price?: number;
}

export interface TripMatch {
  id: string;
  driverName: string;
  vehicle: string;
  route: string;
  eta: string;
  price: number;
  type: 'PASSENGER' | 'CARGO' | 'DUAL';
  confidence: number;
  reason: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  actionTab?: string;
}
