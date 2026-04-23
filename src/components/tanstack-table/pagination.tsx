import { Table } from '@tanstack/react-table';
import SecondaryIconButton from '@commercetools-uikit/secondary-icon-button';
import { AngleLeftIcon, AngleRightIcon } from '@commercetools-uikit/icons';
import { Button } from '@headlessui/react';

const Pagination = <T extends Record<string, unknown>>({
  table,
}: {
  table: Table<T>;
}) => {
  return (
    <div className="flex justify-between items-center">
      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
        className="text-[13px] border border-[#e2e8f0] rounded px-2 py-1 text-[#334155] bg-white cursor-pointer"
      >
        {[20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-4">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <AngleLeftIcon
            color={!table.getCanPreviousPage() ? 'neutral60' : 'primary'}
          />
        </Button>

        <div className="flex items-center gap-2 text-[13px] text-[#334155]">
          Page
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            value={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="w-14 text-center border border-[#e2e8f0] rounded px-2 py-1 text-[13px]"
          />
          of{' '}
          <span id="total-pages">{table.getPageCount().toLocaleString()}</span>
        </div>

        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <AngleRightIcon
            color={!table.getCanNextPage() ? 'neutral60' : 'primary'}
          />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
