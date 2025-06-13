import { IPagination } from "@/Interface/IPagination";
import { getPageNumbers } from "@/utils/getPageNumbers";

type PaginationProps = {
  pagination: IPagination;
  onPageChange: (page: number) => void;
};

const Pagination = ({ pagination, onPageChange }: PaginationProps) => {
  const { totalPages, currentPage, hasNextPage, hasPrevPage } = pagination;

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="max-w-[1200px] mx-auto my-2 px-1 flex justify-center items-center gap-1 mt-6">
      <div className="join gap-1">
        <button
          type="button"
          className="join-item btn btn-outline"
          disabled={!hasPrevPage}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Prev
        </button>

        {pageNumbers.map((page, idx) =>
          page === "..." ? (
            <span key={Math.random()+ idx} className="join-item btn btn-disabled">
              ...
            </span>
          ) : (
            <button
              type="button"
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`join-item btn ${
                currentPage === page ? "btn-active" : ""
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          className="join-item btn btn-outline"
          disabled={!hasNextPage}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
