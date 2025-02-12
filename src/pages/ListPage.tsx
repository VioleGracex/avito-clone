import React from 'react';
import AdList from '../components/AdList.tsx';

const ListPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">List Page</h1>
      <AdList />
    </div>
  );
};

export default ListPage;