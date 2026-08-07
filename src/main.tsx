import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { App as CapApp } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import App from './App';

// ─── Global error diagnostics (remove before public launch) ──────────────────
const showError = (msg: string) => {
  document.body.innerHTML = `
    <div style="min-height:100vh;background:#1e1b4b;color:#e9d5ff;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;font-family:sans-serif;">
      <div style="font-size:40px;margin-bottom:16px;">⚡</div>
      <h1 style="font-size:18px;font-weight:900;margin:0 0 12px;color:#a78bfa;">BuildScript — Startup Error</h1>
      <p style="font-size:12px;word-break:break-all;background:#312e81;padding:12px;border-radius:12px;max-width:340px;line-height:1.6;">${msg}</p>
      <p style="font-size:10px;margin-top:16px;color:#7c3aed;">v1.0.9 — share this screen with support</p>
    </div>`;
};
window.addEventListener('error', (e) => showError(`JS Error: ${e.message} @ ${e.filename}:${e.lineno}`));
window.addEventListener('unhandledrejection', (e) => showError(`Unhandled Promise: ${String(e.reason)}`));
// ─────────────────────────────────────────────────────────────────────────────

// Initialize Capacitor plugins on native platforms
if (Capacitor.isNativePlatform()) {
  StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
  StatusBar.setBackgroundColor({ color: '#0f172a' }).catch(() => {});
  SplashScreen.hide().catch(() => {});

  // Handle Android back button
  CapApp.addListener('backButton', ({ canGoBack }) => {
    if (!canGoBack) CapApp.exitApp();
    else window.history.back();
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);

