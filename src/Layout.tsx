import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdList from './components/AdList';
import AdPage from './pages/AdPage';
import AdForm from './components/AdForm';
import Header from './components/Header';
import MyAdsPage from './pages/MyAdsPage';
import { checkIfLoggedIn } from './services/auth';
import AuthPopup from './components/popups/AuthPopup';
const Layout: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [authView, setAuthView] = useState<'register' | 'login' | 'forgotPassword'>('login');

  const location = useLocation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await checkIfLoggedIn();
      setLoggedIn(loggedIn);
      setLoading(false);
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (location.pathname === '/login') {
      setShowAuthPopup(true);
      setAuthView('login');
    } else {
      setShowAuthPopup(false);
    }
  }, [location]);

  if (loading) {
    return <div className="loading-spinner">Загрузка...</div>; // Add your loading spinner or placeholder here
  }

  return (
    <>
      <Header />
      <div className="App mt-2">
        <Routes>
          <Route path="/" element={<AdList />} />
          <Route path="/list" element={<AdList />} />
          <Route path="/item/:id" element={<AdPage />} />
          <Route path="/form" element={loggedIn ? <AdForm /> : <Navigate to="/login" />} />
          <Route path="/form/:id" element={loggedIn ? <AdForm /> : <Navigate to="/login" />} />
          <Route path="/my-ads" element={loggedIn ? <MyAdsPage /> : <Navigate to="/login" />} />
          <Route path="/login" element={<AdList />} /> {/* Temporary route to trigger AuthPopup */}
        </Routes>
        {showAuthPopup && (
          <AuthPopup
            onClose={() => setShowAuthPopup(false)}
            view={authView}
            onLoginSuccess={() => {
              setShowAuthPopup(false);
              setLoggedIn(true);
            }}
          />
        )}
      </div>
    </>
  );
};

export default Layout;