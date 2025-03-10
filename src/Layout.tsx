import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AdList from './components/AdList';
import AdPage from './pages/AdPage';
import AdForm from './components/AdForm';
import Header from './components/Header';
import MyAdsPage from './pages/MyAdsPage';
import { checkIfLoggedIn } from './services/auth';
import AuthPopup from './components/popups/AuthPopup';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const Layout: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [authView, setAuthView] = useState<'register' | 'login' | 'forgotPassword'>('login');
  const [intendedPath, setIntendedPath] = useState<string>('/');
  const location = useLocation();
  const navigate = useNavigate();

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
      const searchParams = new URLSearchParams(location.search);
      const redirectPath = searchParams.get('intendedPath') || '/';
      setIntendedPath(redirectPath);

      const view = redirectPath === '/register' ? 'register' : 'login';
      setAuthView(view);

      setShowAuthPopup(true);
    } else {
      setShowAuthPopup(false);
    }
  }, [location]);

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {!loading && (
        <>
          <Header loggedIn={loggedIn} onLogout={() => setLoggedIn(false)} />
          <div className="App mt-2">
            <Routes>
              <Route path="/" element={<AdList />} />
              <Route path="/list" element={<AdList />} />
              <Route path="/item/:id" element={<AdPage />} />
              <Route path="/form" element={loggedIn ? <AdForm /> : <Navigate to="/login?intendedPath=/form" />} />
              <Route path="/form/:id" element={loggedIn ? <AdForm /> : <Navigate to={`/login?intendedPath=${encodeURIComponent(location.pathname)}`} />} />
              <Route path="/my-ads" element={loggedIn ? <MyAdsPage /> : <Navigate to="/login?intendedPath=/my-ads" />} />
              <Route path="/login" element={<AdList />} /> {/* Temporary route to trigger AuthPopup */}
            </Routes>
            {showAuthPopup && (
              <AuthPopup
                onClose={() => setShowAuthPopup(false)}
                view={authView}
                onLoginSuccess={() => {
                  setShowAuthPopup(false);
                  setLoggedIn(true);
                  navigate(intendedPath);
                }}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Layout;