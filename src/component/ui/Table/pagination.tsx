import React, { useEffect, useState } from "react";

type PaginationProps = {
  pages: number;
  page: number;
  PageButtonComponent?: React.ElementType;
  onPageChange: (page: number) => void;
  previousText?: string;
  nextText?: string;
  totalResults: number;
};

const defaultButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (
  props
) => <button {...props}>{props.children}</button>;

const Pagination: React.FC<PaginationProps> = ({
  pages,
  page,
  PageButtonComponent = defaultButton,
  onPageChange,
  previousText = "Previous",
  nextText = "Next",
  totalResults
}) => {
  const [visiblePages, setVisiblePages] = useState<number[]>([]);

  useEffect(() => {
    setVisiblePages(getVisiblePages(page + 1, pages));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, page]);

  function filterPages(visiblePages: number[], totalPages: number) {
    return visiblePages.filter((p) => p <= totalPages);
  }

  function getVisiblePages(currentPage: number | null, total: number) {
    if (total < 7) {
      return filterPages([1, 2, 3, 4, 5, 6], total);
    } else {
      if (currentPage && currentPage > 4 && currentPage + 2 < total) {
        return [1, currentPage - 1, currentPage, currentPage + 1, total];
      } else if (currentPage && currentPage > 4 && currentPage + 2 >= total) {
        return [1, total - 3, total - 2, total - 1, total];
      } else {
        return [1, 2, 3, 4, 5, total];
      }
    }
  }

  function changePage(newPage: number) {
    const activePage = page + 1;
    if (newPage === activePage) return;

    const newVisible = getVisiblePages(newPage, pages);
    setVisiblePages(filterPages(newVisible, pages));
    onPageChange(newPage - 1);
  }

  const activePage = page + 1;
  console.log(visiblePages);

  if(pages <= 1) return <div className="mt-3" ></div>;


  return (
    <div className="Table__pagination border border-t border-table-border">

      <div className="flex-center gap-2">
          <div className="Table__visiblePagesWrapper">
           {((activePage-1)* 10 ) + 1} - { ((activePage-1)* 10 ) + (activePage === visiblePages.length ? ( totalResults %10) : 10) } of {totalResults} results
          </div>
      </div>


      <div className="flex-center gap-2">

            <div className="Table__visiblePagesWrapper">
             {activePage} of {visiblePages.length} pages
            </div>

          {/* Previous */}
          <div className="Table__prevPageWrapper">
            <PageButtonComponent
              className="Table__pageButton text-xs"
              onClick={() => {
                if (activePage === 1) return;
                changePage(activePage - 1);
              }}
              disabled={activePage === 1}
            >
              {previousText}
            </PageButtonComponent>
          </div>

          {/* Next */}
          <div className="Table__nextPageWrapper">
            <PageButtonComponent
              className="Table__pageButton text-xs"
              onClick={() => {
                if (activePage === pages) return;
                changePage(activePage + 1);
              }}
              disabled={activePage === pages}
            >
              {nextText}
            </PageButtonComponent>
          </div>
      </div>

    </div>
  );
};

export default Pagination;
