import {
  AngleUpDownIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  FilterIcon,
} from '@commercetools-uikit/icons';
import FilterPopover from './filter-popover';
import { ColumnFiltersState, flexRender, Header } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo, useRef, useState } from 'react';
import getNestedValue from '../../utils/nested-attributes';
import getCommonPinningStyles from './column-pin';

interface ColumnHeaderProps<T> {
  header: Header<T, unknown>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
  data: T[];
}

const ColumnHeader = <T extends Record<string, unknown>>({
  header,
  columnFilters,
  setColumnFilters,
  data,
}: ColumnHeaderProps<T>) => {
  const getUniqueValues = (key: string): string[] => {
    const allValues = data.flatMap((row) => {
      const nested = getNestedValue(row as Record<string, unknown>, key);
      if (Array.isArray(nested)) return nested.map(String);
      return [String(nested ?? '')];
    });

    return Array.from(new Set(allValues)).sort();
  };

  const getActiveFilters = (key: string): string[] => {
    const filter = columnFilters.find((f) => f.id === key);
    return (filter?.value as string[]) ?? [];
  };

  const onFilterSubmit = (columnKey: string, values: string[]) => {
    const filters = () => {
      const without = columnFilters.filter((f) => f.id !== columnKey);
      if (values.length === 0) return without;
      return [...without, { id: columnKey, value: values }];
    };

    setColumnFilters(filters());
  };
  const activeFilters = useMemo(
    () => getActiveFilters(header.column.id),
    [header, columnFilters]
  );
  const uniqueValues = useMemo(
    () => getUniqueValues(header.column.id),
    [data, header]
  );

  const [openFilter, setOpenFilter] = useState<string | null>();

  const colKey = header.column.id;
  const isOpen = openFilter === colKey;
  const hasFilter = activeFilters.length > 0;
  const sorted = header.column.getIsSorted();

  const filterRef = useRef<HTMLSpanElement>(null);

  // Resolve the header label
  const renderedHeader = flexRender(
    header.column.columnDef.header,
    header.getContext()
  );

  const headerContent = String(renderedHeader).includes('\n') ? (
    <span className="flex flex-col leading-tight" id="header-label">
      {String(renderedHeader)
        .split('\n')
        .map((line, i) => (
          <span key={i}>{line}</span>
        ))}
    </span>
  ) : (
    <span className="truncate" id="header-label">
      {String(renderedHeader)}
    </span>
  );

  return (
    <th
      style={{
        ...getCommonPinningStyles(header.column, header),
      }}
      className="px-4 py-2.5 text-left font-semibold text-[11px] tracking-[0.05em] uppercase text-[#64748b] bg-[#f8fafc] border-[#e2e8f0] whitespace-nowrap relative w-auto border-r-2 border-r-[#e2e8f0]"
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
      key={header.id}
      id={header.id}
    >
      <div className="flex items-center gap-1.5">
        <span
          className="flex-1 cursor-pointer select-none overflow-hidden truncate min-w-0"
          onClick={header.column.getToggleSortingHandler()}
        >
          {headerContent}
        </span>

        <span
          className="flex items-center text-[#94a3b8] shrink-0 cursor-pointer"
          onClick={header.column.getToggleSortingHandler()}
          data-testid={`sorting-${header.id}`}
        >
          {sorted === 'asc' ? (
            <ArrowUpIcon color="neutral60" size="small" />
          ) : sorted === 'desc' ? (
            <ArrowDownIcon color="neutral60" size="small" />
          ) : (
            <AngleUpDownIcon color="neutral60" size="small" />
          )}
        </span>

        {header.column.getCanFilter() && (
          <span
            ref={filterRef}
            className="flex items-center text-[#94a3b8] shrink-0 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setOpenFilter(isOpen ? null : colKey);
            }}
            data-testid={`column-filter-${header.id}`}
          >
            <FilterIcon
              size="small"
              color={hasFilter ? 'primary' : 'neutral60'}
              id="column-filter"
            />
          </span>
        )}

        {hasFilter && (
          <span className="inline-flex items-center justify-center min-w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-bold px-1">
            {activeFilters.length}
          </span>
        )}
      </div>

      {isOpen && (
        <FilterPopover
          columnKey={colKey}
          options={uniqueValues}
          activeFilters={activeFilters}
          onSubmit={onFilterSubmit}
          onClose={() => setOpenFilter(null)}
          anchorEl={filterRef.current}
        />
      )}

      <div
        onMouseDown={header.getResizeHandler()}
        onTouchStart={header.getResizeHandler()}
        className={`absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none bg-transparent hover:bg-blue-400 ${
          header.column.getIsResizing()
            ? 'bg-blue-500 opacity-100'
            : 'opacity-0'
        }`}
      />
    </th>
  );
};

export default ColumnHeader;
