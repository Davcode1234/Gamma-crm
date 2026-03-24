import { useState } from 'react';

const usePagination = (data, itemsNumber) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsNumber);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = data.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  return {
    totalPages,
    totalItems,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    currentTasks,
    handleNextPage,
    handlePreviousPage,
  };
};

export default usePagination;
