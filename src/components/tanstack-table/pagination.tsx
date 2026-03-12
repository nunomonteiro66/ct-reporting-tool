import { Table } from '@tanstack/react-table';
import SecondaryIconButton from '@commercetools-uikit/secondary-icon-button';
import { AngleLeftIcon, AngleRightIcon } from '@commercetools-uikit/icons';
import s from './styles.module.css';

const Pagination = <T extends Record<string, unknown>>({
  table,
}: {
  table: Table<T>;
}) => {
  return (
    <div className={s.paginationBody}>
      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
      >
        {[20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>

      <div className={s.paginator}>
        <SecondaryIconButton
          icon={
            <AngleLeftIcon
              //color={!table.getCanPreviousPage() ? 'neutral60' : 'primary'}
              color="neutral60"
            />
          }
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          label=""
        />

        <div className={s.paginatorPages}>
          Page
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
          />
          of {table.getPageCount().toLocaleString()}
        </div>

        <SecondaryIconButton
          icon={
            <AngleRightIcon
              color={!table.getCanNextPage() ? 'neutral60' : 'primary'}
            />
          }
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          label=""
        />
      </div>
    </div>
  );
};

export default Pagination;
