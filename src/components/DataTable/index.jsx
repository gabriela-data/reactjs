import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

const collator = new Intl.Collator('pt-BR', {
  numeric: true,
  sensitivity: 'base',
});

export default function DataTable({
  columns,
  data = [],
  rowKey = 'id',
  caption = 'Tabela de dados',
  loading = false,
  loadingRows = 5,
  emptyState = 'Nenhum registro encontrado.',
  selectable = false,
  selectedKeys,
  onSelectionChange,
}) {
  const [sort, setSort] = useState({ key: null, direction: 'asc' });
  const [internalSelectedKeys, setInternalSelectedKeys] = useState([]);
  const getRowKey = (row) =>
    typeof rowKey === 'function' ? rowKey(row) : row[rowKey];
  const selected = new Set(selectedKeys ?? internalSelectedKeys);
  const selectedRows = data.filter((row) => selected.has(getRowKey(row)));
  const allSelected = data.length > 0 && selectedRows.length === data.length;
  const someSelected = selectedRows.length > 0 && !allSelected;
  const columnCount = columns.length + (selectable ? 1 : 0);

  const sortedData = useMemo(() => {
    const column = columns.find((item) => item.key === sort.key);
    if (!column || column.sortable === false) return data;

    const valueOf = column.sortValue ?? ((row) => row[column.key]);

    return [...data].sort((left, right) => {
      const leftValue = valueOf(left);
      const rightValue = valueOf(right);

      // Valores ausentes ficam no final em ambas as direcoes.
      if (leftValue == null && rightValue == null) return 0;
      if (leftValue == null) return 1;
      if (rightValue == null) return -1;

      const comparison =
        typeof leftValue === 'number' && typeof rightValue === 'number'
          ? leftValue - rightValue
          : collator.compare(String(leftValue), String(rightValue));

      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }, [columns, data, sort]);

  const updateSelection = (keys) => {
    if (selectedKeys === undefined) setInternalSelectedKeys(keys);
    const nextSelected = new Set(keys);
    onSelectionChange?.(
      keys,
      data.filter((row) => nextSelected.has(getRowKey(row)))
    );
  };

  const toggleRow = (row) => {
    const key = getRowKey(row);
    const keys = selectedRows.map(getRowKey);
    updateSelection(
      selected.has(key) ? keys.filter((item) => item !== key) : [...keys, key]
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div
        role="region"
        aria-label={caption}
        tabIndex={0}
        className="overflow-x-auto focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
      >
        <table className="w-full text-left text-sm" aria-busy={loading}>
          <caption className="sr-only">{caption}</caption>
          <thead className="border-b border-gray-200 bg-gray-50 text-gray-700">
            <tr>
              {selectable && (
                <th scope="col" className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label="Selecionar todos os registros"
                    checked={allSelected && !loading}
                    disabled={loading || data.length === 0}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected && !loading;
                    }}
                    onChange={() =>
                      updateSelection(allSelected ? [] : data.map(getRowKey))
                    }
                    className="size-4 cursor-pointer accent-primary disabled:cursor-not-allowed"
                  />
                </th>
              )}
              {columns.map((column) => {
                const isSorted = sort.key === column.key;
                const SortIcon = isSorted
                  ? sort.direction === 'asc'
                    ? ArrowUp
                    : ArrowDown
                  : ArrowUpDown;

                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={
                      column.sortable === false
                        ? undefined
                        : isSorted
                          ? sort.direction === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : 'none'
                    }
                    className="whitespace-nowrap px-4 py-3 font-semibold"
                  >
                    {column.sortable === false ? (
                      column.header
                    ) : (
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() =>
                          setSort((current) => ({
                            key: column.key,
                            direction:
                              current.key === column.key &&
                              current.direction === 'asc'
                                ? 'desc'
                                : 'asc',
                          }))
                        }
                        className="flex items-center gap-2 rounded text-left hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed"
                      >
                        {column.header}
                        <SortIcon
                          aria-hidden="true"
                          className="size-4 shrink-0"
                        />
                      </button>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <>
                <tr className="sr-only">
                  <td colSpan={columnCount} role="status">
                    Carregando registros...
                  </td>
                </tr>
                {Array.from({ length: loadingRows }, (_, index) => (
                  <tr key={index} aria-hidden="true">
                    {Array.from({ length: columnCount }, (_, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-4">
                        <div className="h-4 rounded bg-gray-200 motion-safe:animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            ) : sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columnCount}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  {emptyState}
                </td>
              </tr>
            ) : (
              sortedData.map((row) => {
                const key = getRowKey(row);
                const isSelected = selectable && selected.has(key);

                return (
                  <tr
                    key={key}
                    className={isSelected ? 'bg-primary/5' : 'hover:bg-gray-50'}
                  >
                    {selectable && (
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          aria-label={`Selecionar registro ${key}`}
                          checked={isSelected}
                          onChange={() => toggleRow(row)}
                          className="size-4 cursor-pointer accent-primary"
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="whitespace-nowrap px-4 py-4 text-gray-700"
                      >
                        {column.render
                          ? column.render(row[column.key], row)
                          : (row[column.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
