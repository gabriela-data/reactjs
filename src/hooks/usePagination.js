import { useState } from 'react';

export default function usePagination(initialPage = 1, initialPageSize = 10) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const changePageSize = (nextSize) => {
    setPageSize(nextSize);
    setPage(1);
  };

  return { page, pageSize, setPage, setPageSize: changePageSize };
}
