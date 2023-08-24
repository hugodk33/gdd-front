import React from 'react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav>
      <ul className="flex flex-row gap-2 pagination justify-center">
        {pageNumbers.map((pageNumber) => (
          <li
            key={pageNumber}
            className={"flex justify-center rounded-full bg-gray-100 h-10 w-10 text-xl " + (pageNumber === currentPage ? 'active' : '')}
          >
            <button onClick={() => onPageChange(pageNumber)}>{pageNumber}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
