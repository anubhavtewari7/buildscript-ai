import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange } from '../services/auth';
import { getUserProfile, updateLastLogin } from '../services/db';
import { UserProfile } from '../types';
import { initializePurchases } from '../services/purchases';

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      try {
        if (firebaseUser) {
          const p = await getUserProfile(firebaseUser.uid);
          setProfile(p);
          if (p) {
            await updateLastLogin(firebaseUser.uid);
            await initializePurchases(firebaseUser.uid);
          }
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error('Auth state error:', err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  return { user, profile, loading };
};
