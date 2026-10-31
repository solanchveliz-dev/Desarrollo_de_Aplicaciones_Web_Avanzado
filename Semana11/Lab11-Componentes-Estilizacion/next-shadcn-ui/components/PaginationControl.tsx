"use client"

import {
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"

export function PaginationControl({
  page,
  pageCount,
  pageSize,
  totalItems,
  onPageChange,
}: {
  page: number
  pageCount: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
}) {
  return (
    <div className="mt-5 flex flex-col items-center justify-between gap-2 sm:flex-row">
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {totalItems
          ? `Mostrando ${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, totalItems)} de ${totalItems}`
          : "No hay elementos para mostrar"}
      </p>
      {pageCount > 1 && (
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
            <PaginationPrevious
              href="#"
              text="Anterior"
              aria-disabled={page === 1}
              className={page === 1 ? "pointer-events-none opacity-40" : ""}
              onClick={(event) => {
                event.preventDefault()
                onPageChange(Math.max(1, page - 1))
              }}
            />
          </PaginationItem>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href="#"
                  isActive={pageNumber === page}
                  aria-label={`Página ${pageNumber}`}
                  onClick={(event) => {
                    event.preventDefault()
                    onPageChange(pageNumber)
                  }}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                text="Siguiente"
                aria-disabled={page === pageCount}
                className={page === pageCount ? "pointer-events-none opacity-40" : ""}
                onClick={(event) => {
                  event.preventDefault()
                  onPageChange(Math.min(pageCount, page + 1))
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
