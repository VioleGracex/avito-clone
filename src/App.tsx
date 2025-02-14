import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdList from './components/AdList';
import AdPage from './pages/AdPage';
import AdForm from './components/AdForm';
import Header from './components/Header';
import MyAdsPage from './pages/MyAdsPage';
import { checkIfLoggedIn } from './services/auth';

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await checkIfLoggedIn();
      setLoggedIn(loggedIn);
      setLoading(false);
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Загрузка...</div>; // Add your loading spinner or placeholder here
  }

  return (
    <Router>
      <Header />
      <div className="App mt-2">
        <Routes>
          <Route path="/" element={<AdList />} />
          <Route path="/list" element={<AdList />} />
          <Route path="/item/:id" element={<AdPage />} />
          <Route path="/form" element={loggedIn ? <AdForm /> : <Navigate to="/" />} />
          <Route path="/form/:id" element={loggedIn ? <AdForm /> : <Navigate to="/" />} />
          <Route path="/my-ads" element={loggedIn ? <MyAdsPage /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;