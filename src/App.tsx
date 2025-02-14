import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './Layout.tsx';

const App: React.FC = () => (
  <Router>
    <Layout />
  </Router>
);

export default App;