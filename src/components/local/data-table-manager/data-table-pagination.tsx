import { ChevronLeft, ChevronRight } from "lucide-react"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/global/atoms/ui/pagination"

interface TablePaginationProps {
  pageIndex: number
  pageCount: number
  onPageChange: (newPageIndex: number) => void
}

const TablePagination: React.FC<TablePaginationProps> = ({
  pageIndex,
  pageCount,
  onPageChange
}) => {
  const siblingCount = 2

  const leftSiblingIndex = Math.max(pageIndex - siblingCount, 0)
  const rightSiblingIndex = Math.min(pageIndex + siblingCount, pageCount - 1)

  const shouldShowLeftEllipsis = leftSiblingIndex > 1
  const shouldShowRightEllipsis = rightSiblingIndex < pageCount - 2

  const firstPageIndex = Math.max(0, leftSiblingIndex)
  const lastPageIndex = Math.min(pageCount - 1, rightSiblingIndex)

  const handlePrevious = () => {
    if (pageIndex > 0) onPageChange(pageIndex - 1)
  }

  const handleNext = () => {
    if (pageIndex < pageCount - 1) onPageChange(pageIndex + 1)
  }

  return (
    <Pagination className="mb-10 select-none">
      <PaginationContent className="cursor-pointer">
        <PaginationItem>
          <PaginationPrevious onClick={() => onPageChange(0)} />
        </PaginationItem>

        <PaginationItem className="mr-4">
          <PaginationLink
            onClick={handlePrevious}
            className="bg-transparent shadow-none duration-300 ease-in-out hover:bg-transparent"
            aria-label="Go to previous page"
          >
            <ChevronLeft />
          </PaginationLink>
        </PaginationItem>

        {shouldShowLeftEllipsis && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(0)}>1</PaginationLink>
            </PaginationItem>
            <PaginationEllipsis />
          </>
        )}

        {[...Array(lastPageIndex - firstPageIndex + 1).keys()].map((page) => (
          <PaginationItem key={page + firstPageIndex}>
            <PaginationLink
              onClick={() => onPageChange(page + firstPageIndex)}
              className={`duration-300 ease-in-out hover:bg-primary hover:text-red-100 ${
                pageIndex === page + firstPageIndex
                  ? "bg-primary text-white"
                  : ""
              }`}
            >
              {page + firstPageIndex + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        {shouldShowRightEllipsis && (
          <>
            <PaginationEllipsis />
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(pageCount - 1)}>
                {pageCount}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem className="ml-4">
          <PaginationLink
            onClick={handleNext}
            className="bg-tr bg-transparent shadow-none duration-300 ease-in-out hover:bg-transparent"
            aria-label="Go to next page"
          >
            <ChevronRight />
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext onClick={() => onPageChange(pageCount - 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default TablePagination
