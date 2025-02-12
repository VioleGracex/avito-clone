import React from 'react';

interface PaginationProps {
  adsPerPage: number;
  totalAds: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

const AdPagination: React.FC<PaginationProps> = ({ adsPerPage, totalAds, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalAds / adsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination flex justify-center">
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <button onClick={() => paginate(number)} className="page-link p-2 border rounded-md mx-1">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AdPagination;