export type FuelType = 'gas' | 'diesel' | 'electric' | 'hybrid';
export type SubscriptionTier = 'free' | 'pro' | 'premium';
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type Difficulty = 'easy' | 'moderate' | 'advanced';

export interface VehicleLogs {
  lastOilChangeMileage?: number;
  lastOilChangeDate?: string;
  lastTirePressureValue?: number;
  lastTirePressureCheckDate?: string;
  evChargingHistory?: EVChargeSession[];
}

export interface EVChargeSession {
  date: string;
  durationMinutes: number;
  startPercentage: number;
  endPercentage: number;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  vin?: string;
  fuelType: FuelType;
  logs?: VehicleLogs;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  subscriptionTier: SubscriptionTier;
  activeVehicleId: string;
  vehicles: Vehicle[];
  createdAt: number;
  lastLogin: number;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'error';
  text: string;
  timestamp: number;
  image?: string;
}

export interface DiagnosticResult {
  code: string;
  title: string;
  description: string;
  severity: Severity;
  likelyCauses: string[];
  estimatedRepairCost: string;
  partsNeeded: string[];
  canDrive: boolean;
  diyInstructions?: {
    feasibility: string;
    tools: string[];
    steps: string[];
    savings: string;
  };
}

export interface PerformanceImpact {
  label: string;
  stock: number;
  modded: number;
  unit: string;
}

export interface Modification {
  id: string;
  name: string;
  category: string;
  description: string;
  costEstimate: string;
  difficulty: Difficulty;
  performanceImpact: PerformanceImpact[];
  installationSteps: string[];
  requiredTools: string[];
}

export interface MaintenanceItem {
  id: string;
  title: string;
  dueDate: string;
  dueMileage: number;
  completed: boolean;
  notes?: string;
}
