import React from 'react';
import AdForm from '../components/AdForm.tsx';

const FormPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl text-primary font-bold mb-4">Form Page</h1>
      <AdForm />
    </div>
  );
};

export default FormPage;