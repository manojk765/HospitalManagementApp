"use client";

import { useEffect, useState } from "react"; 
import { useRouter } from "next/navigation";

const ITEM_PER_PAGE = 10;

const Pagination = ({ page, count }: { page: number; count: number }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(page);

  const totalPages = Math.ceil(count / ITEM_PER_PAGE);
  
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${params}`);
  };

  return (
    <div className="p-4 flex items-center justify-between text-gray-500">
      
      <button
        disabled={!hasPrev}
        className={`py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold ${
          !hasPrev ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => changePage(currentPage - 1)}
      >
        Prev
      </button>

      
      <div className="flex items-center gap-2 text-sm">
        {Array.from({ length: totalPages }, (_, index) => {
          const pageIndex = index + 1;
          return (
            <button
              key={pageIndex}
              className={`px-2 rounded-sm ${
                currentPage === pageIndex ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => changePage(pageIndex)}
            >
              {pageIndex}
            </button>
          );
        })}
      </div>

     
      <button
        disabled={!hasNext}
        className={`py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold ${
          !hasNext ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => changePage(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
