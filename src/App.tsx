import React, { useState, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { UserProfile, Vehicle } from './types';
import { updateUserVehicles } from './services/db';
import Navigation from './components/Navigation';
import LoadingScreen from './components/LoadingScreen';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import AIChat from './pages/AIChat';
import DiagnosticTool from './pages/DiagnosticTool';
import Modifications from './pages/Modifications';
import Maintenance from './pages/Maintenance';
import Profile from './pages/Profile';
import RecommendedTools from './pages/RecommendedTools';
import OBDPortLocator from './pages/OBDPortLocator';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import VirtualGarage from './pages/VirtualGarage';
import TermsPrivacy from './pages/TermsPrivacy';
import TowService from './pages/TowService';
import NearbyShops from './pages/NearbyShops';

const App: React.FC = () => {
  const { user, profile: initialProfile, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Sync local profile state with auth hook on first load
  React.useEffect(() => {
    if (initialProfile && !profile) setProfile(initialProfile);
  }, [initialProfile, profile]);

  React.useEffect(() => {
    if (!user) setProfile(null);
  }, [user]);

  const handleProfileUpdate = useCallback((updated: Partial<UserProfile>) => {
    setProfile(prev => prev ? { ...prev, ...updated } : prev);
  }, []);

  const handleUpdateVehicle = useCallback(async (updated: Vehicle) => {
    if (!profile) return;
    const vehicles = (profile.vehicles ?? []).map(v => v.id === updated.id ? updated : v);
    await updateUserVehicles(profile.uid, vehicles, profile.activeVehicleId);
    handleProfileUpdate({ vehicles });
  }, [profile, handleProfileUpdate]);

  const navigate = useNavigate();

  if (loading) return <LoadingScreen />;

  if (!user || !profile) {
    return <Welcome onAuthComplete={() => {
      // Auth state will update via onAuthStateChanged, triggering useAuth re-render
    }} />;
  }

  const FALLBACK_VEHICLE: Vehicle = {
    id: 'none', make: 'Unknown', model: 'Vehicle',
    year: new Date().getFullYear(), mileage: 0, fuelType: 'gas',
  };
  const activeVehicle = (profile.vehicles ?? []).find(v => v.id === profile.activeVehicleId)
    || (profile.vehicles ?? [])[0]
    || FALLBACK_VEHICLE;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-950 shadow-2xl relative overflow-x-hidden">
      <Routes>
        <Route path="/" element={<Dashboard vehicle={activeVehicle} onUpdateVehicle={handleUpdateVehicle} />} />
        <Route path="/ai-chat" element={<AIChat vehicle={activeVehicle} />} />
        <Route path="/diagnostics" element={<DiagnosticTool vehicle={activeVehicle} />} />
        <Route path="/modifications" element={
          <Modifications
            vehicle={activeVehicle}
            subscriptionTier={profile.subscriptionTier}
            onUpgrade={() => navigate('/profile?plans=1')}
          />
        } />
        <Route path="/maintenance" element={<Maintenance vehicle={activeVehicle} />} />
        <Route path="/profile" element={
          <Profile profile={profile} onProfileUpdate={handleProfileUpdate} />
        } />
        <Route path="/tools" element={<RecommendedTools />} />
        <Route path="/obd-locator" element={<OBDPortLocator />} />
        <Route path="/checkout" element={
          <Checkout uid={profile.uid} onProfileUpdate={handleProfileUpdate} />
        } />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/garage" element={
          <VirtualGarage vehicle={activeVehicle} subscriptionTier={profile.subscriptionTier} />
        } />
        <Route path="/terms" element={<TermsPrivacy />} />
        <Route path="/tow-service" element={<TowService />} />
        <Route path="/nearby-shops" element={<NearbyShops />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Navigation />
    </div>
  );
};

export default App;
