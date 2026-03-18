import {
  AngleUpDownIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  FilterIcon,
} from '@commercetools-uikit/icons';
import FilterPopover from './filter-popover';
import { flexRender, Header } from '@tanstack/react-table';
import { useRef } from 'react';

interface ColumnHeaderProps<T> {
  header: Header<T, unknown>;
  openFilter: string | null;
  setOpenFilter: (key: string | null) => void;
  activeFilters: string[];
  uniqueValues: string[];
  onFilterSubmit: (columnKey: string, values: string[]) => void;
}

const ColumnHeader = <T,>({
  header,
  openFilter,
  setOpenFilter,
  activeFilters,
  uniqueValues,
  onFilterSubmit,
}: ColumnHeaderProps<T>) => {
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

  //when the label is an array, split into multiple lines
  /*  const headerContent = Array.isArray(renderedHeader) ? (
    <span className="flex flex-col leading-tight">
      {renderedHeader.map((line, i) => (
        <span key={i}>{line}</span>
      ))}
    </span>
  ) : (
    <span className="truncate">{renderedHeader}</span>
  ); */

  const headerContent = String(renderedHeader).includes('\n') ? (
    <span className="flex flex-col leading-tight">
      {String(renderedHeader)
        .split('\n')
        .map((line, i) => (
          <span key={i}>{line}</span>
        ))}
    </span>
  ) : (
    <span className="truncate">{String(renderedHeader)}</span>
  );

  return (
    <th
      style={{ width: header.getSize() }}
      className="px-4 py-2.5 text-left font-semibold text-[11px] tracking-[0.05em] uppercase text-[#64748b] bg-[#f8fafc] border-b border-[#e2e8f0] whitespace-nowrap relative w-auto"
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
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
        >
          {sorted === 'asc' ? (
            <ArrowUpIcon color="neutral60" size="small" />
          ) : sorted === 'desc' ? (
            <ArrowDownIcon color="neutral60" size="small" />
          ) : (
            <AngleUpDownIcon color="neutral60" size="small" />
          )}
        </span>

        <span
          ref={filterRef}
          className="flex items-center text-[#94a3b8] shrink-0 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setOpenFilter(isOpen ? null : colKey);
          }}
        >
          <FilterIcon
            size="small"
            color={hasFilter ? 'primary' : 'neutral60'}
          />
        </span>

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
