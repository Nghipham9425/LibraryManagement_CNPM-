import { Pagination as BSPagination } from 'react-bootstrap';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // First page
    if (startPage > 1) {
      pages.push(
        <BSPagination.Item key={1} onClick={() => handlePageChange(1)}>
          1
        </BSPagination.Item>
      );
      if (startPage > 2) {
        pages.push(<BSPagination.Ellipsis key="ellipsis-start" disabled />);
      }
    }

    // Page numbers
    for (let page = startPage; page <= endPage; page++) {
      pages.push(
        <BSPagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </BSPagination.Item>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<BSPagination.Ellipsis key="ellipsis-end" disabled />);
      }
      pages.push(
        <BSPagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </BSPagination.Item>
      );
    }

    return pages;
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-4">
      <BSPagination>
        <BSPagination.First
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        />
        <BSPagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        
        {renderPageNumbers()}
        
        <BSPagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <BSPagination.Last
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </BSPagination>
      
      <span className="ms-3 text-muted">
        Trang {currentPage} / {totalPages}
      </span>
    </div>
  );
};

export default Pagination;
