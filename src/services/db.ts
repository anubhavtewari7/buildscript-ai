import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile, Vehicle, SubscriptionTier } from '../types';

const USERS = 'users';

export const createUserProfile = async (
  uid: string,
  name: string,
  email: string,
  initialVehicle: Vehicle
): Promise<void> => {
  const profile: Omit<UserProfile, 'createdAt' | 'lastLogin'> & { createdAt: any; lastLogin: any } = {
    uid,
    name,
    email,
    subscriptionTier: 'free',
    activeVehicleId: initialVehicle.id,
    vehicles: [initialVehicle],
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
  };
  await setDoc(doc(db, USERS, uid), profile);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const snap = await getDoc(doc(db, USERS, uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  // Convert Firestore Timestamps to epoch milliseconds (numbers) so types stay consistent
  return {
    ...data,
    createdAt: data.createdAt?.toMillis?.() ?? data.createdAt ?? Date.now(),
    lastLogin: data.lastLogin?.toMillis?.() ?? data.lastLogin ?? Date.now(),
    vehicles: data.vehicles ?? [],
  } as UserProfile;
};

export const updateUserVehicles = async (uid: string, vehicles: Vehicle[], activeVehicleId: string): Promise<void> => {
  await updateDoc(doc(db, USERS, uid), { vehicles, activeVehicleId });
};

export const updateSubscriptionTier = async (uid: string, tier: SubscriptionTier): Promise<void> => {
  await updateDoc(doc(db, USERS, uid), { subscriptionTier: tier });
};

export const updateLastLogin = async (uid: string): Promise<void> => {
  await updateDoc(doc(db, USERS, uid), { lastLogin: serverTimestamp() });
};

export const updateUserProfile = async (uid: string, updates: { name?: string; phone?: string }): Promise<void> => {
  await updateDoc(doc(db, USERS, uid), updates);
};
