import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdList from './components/AdList';
import AdPage from './pages/AdPage';
import AdForm from './components/AdForm';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <div className="App mt-2">
        <Routes>
          <Route path="/" element={<AdList />} />
          <Route path="/list" element={<AdList />} />
          <Route path="/item/:id" element={<AdPage />} />
          <Route path="/form" element={<AdForm />} />
          <Route path="/form/:id" element={<AdForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;