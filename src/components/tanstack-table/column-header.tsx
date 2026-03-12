import {
  AngleUpDownIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  FilterIcon,
} from '@commercetools-uikit/icons';
import FilterPopover from './filter-popover';
import s from './styles.module.css';
import { flexRender, Header } from '@tanstack/react-table';

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

  return (
    <th className={s.th}>
      <div className={s.thInner}>
        <span
          className={s.thLabel}
          onClick={header.column.getToggleSortingHandler()}
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
        </span>

        <span
          className={s.sortIcon}
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
          className={s.filterIcon}
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

        {hasFilter && <span className={s.badge}>{activeFilters.length}</span>}
      </div>

      {isOpen && (
        <FilterPopover
          columnKey={colKey}
          options={uniqueValues}
          activeFilters={activeFilters}
          onSubmit={onFilterSubmit}
          onClose={() => setOpenFilter(null)}
        />
      )}
    </th>
  );
};

export default ColumnHeader;
