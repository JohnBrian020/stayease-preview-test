import React from "react";
import Button from "./Button";

function Pagination({
  currentPage,
  totalPages,
  onPageChange
}) {
  if (totalPages <= 1) return null;

  function getPages() {
    const pages = [];

    for (let page = 1; page <= totalPages; page += 1) {
      pages.push(page);
    }

    return pages;
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <Button
        variant="outline"
        size="small"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>

      <div className="pagination-pages">
        {getPages().map((page) => (
          <button
            type="button"
            key={page}
            className={
              page === currentPage
                ? "pagination-page active"
                : "pagination-page"
            }
            aria-current={page === currentPage ? "page" : undefined}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <Button
        variant="outline"
        size="small"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </nav>
  );
}

export default Pagination;