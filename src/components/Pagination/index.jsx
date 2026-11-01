import { useId } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function getPageItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const visiblePages = [
    ...new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages]),
  ]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((left, right) => left - right);
  const items = [];

  visiblePages.forEach((page, index) => {
    const previous = visiblePages[index - 1];
    if (page - previous === 2) items.push(previous + 1);
    else if (page - previous > 2) items.push(`gap-${page}`);
    items.push(page);
  });

  return items;
}

export default function Pagination({
  page = 1,
  pageSize = 10,
  totalItems = 0,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  disabled = false,
}) {
  const selectId = useId();
  const size = Number.isInteger(pageSize) && pageSize > 0 ? pageSize : 10;
  const total = Number.isFinite(totalItems)
    ? Math.max(0, Math.floor(totalItems))
    : 0;
  const totalPages = Math.max(1, Math.ceil(total / size));
  const currentPage = Math.min(
    totalPages,
    Math.max(1, Number.isFinite(page) ? Math.floor(page) : 1)
  );
  const firstItem = total === 0 ? 0 : (currentPage - 1) * size + 1;
  const lastItem = Math.min(currentPage * size, total);
  const sizeOptions = [...new Set([...pageSizeOptions, size])]
    .filter((option) => Number.isInteger(option) && option > 0)
    .sort((left, right) => left - right);
  const navigationDisabled = disabled || !onPageChange;
  const buttonClassName =
    'flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-lg border border-gray-200 px-3 text-sm text-gray-700 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50';

  const changePage = (nextPage) => {
    if (nextPage !== currentPage) onPageChange?.(nextPage);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4">
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
        <p role="status" aria-atomic="true">
          {firstItem}–{lastItem} de {total} registros
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor={selectId}>Itens por página</label>
          <select
            id={selectId}
            value={size}
            disabled={disabled || !onPageSizeChange}
            onChange={(event) => {
              onPageSizeChange?.(Number(event.target.value));
              onPageChange?.(1);
            }}
            className="min-h-11 rounded-lg border border-gray-300 bg-white px-2 text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <nav aria-label="Paginação">
        <ul className="flex flex-wrap items-center gap-1">
          <li>
            <button
              type="button"
              aria-label="Página anterior"
              disabled={navigationDisabled || currentPage === 1}
              onClick={() => changePage(currentPage - 1)}
              className={buttonClassName}
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
              <span className="sr-only sm:not-sr-only">Anterior</span>
            </button>
          </li>
          {getPageItems(currentPage, totalPages).map((item) => (
            <li key={item}>
              {typeof item === 'number' ? (
                <button
                  type="button"
                  aria-label={`Página ${item}`}
                  aria-current={item === currentPage ? 'page' : undefined}
                  disabled={navigationDisabled}
                  onClick={() => changePage(item)}
                  className={`${buttonClassName} ${item === currentPage ? 'border-primary bg-primary/10 font-semibold text-primary' : ''}`}
                >
                  {item}
                </button>
              ) : (
                <span
                  aria-hidden="true"
                  className="flex min-h-11 items-center px-1 text-gray-400"
                >
                  …
                </span>
              )}
            </li>
          ))}
          <li>
            <button
              type="button"
              aria-label="Próxima página"
              disabled={navigationDisabled || currentPage === totalPages}
              onClick={() => changePage(currentPage + 1)}
              className={buttonClassName}
            >
              <span className="sr-only sm:not-sr-only">Próxima</span>
              <ChevronRight aria-hidden="true" className="size-4" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
