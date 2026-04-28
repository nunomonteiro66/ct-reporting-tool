import { fireEvent, render, screen, within } from '@testing-library/react';
import TanstackTable from '../tanstack-table';
import { expected } from '../../../../test-data/mapped';
import { mockColumns } from '../../../../test-data/columns';
import { flattenColumnKeys } from '../../../utils/flatten-columns';
import { act } from 'react';

describe('Table reflects the data correctly', () => {
  const mockColumns = [
    { key: 'a', label: 'A' },
    {
      key: 'b',
      label: 'B',
      children: [
        { key: 'b-a', label: 'B-A' },
        { key: 'b-b', label: 'B-B' },
      ],
    },
    { key: 'c', label: 'C' },
  ];

  const mockData = [{ a: 1, b: { 'b-a': 2, 'b-b': 3 }, c: 4 }];

  const mockSetTable = jest.fn();

  const mockPagination = { pageIndex: 0, pageSize: 10 };
  const mockSetPagination = jest.fn();

  const tableComponent = () =>
    render(
      <TanstackTable
        data={mockData}
        columns={mockColumns}
        visibleColumns={['a', 'b.b-a', 'b.b-b', 'c']}
        columnOrder={['a', 'c', 'b.b-b']}
        setTable={mockSetTable}
        pinnedColumns={[]}
        pagination={mockPagination}
        setPagination={mockSetPagination}
      />
    );

  it('renders columns in correct order', () => {
    tableComponent();

    const thead = document.querySelector('thead')!;
    const rows = thead.querySelectorAll('tr');

    const result = [...rows].map((row) => {
      const headers = row.querySelectorAll('th');
      return [...headers].map((h) => h.textContent?.trim());
    });

    expect(result).toEqual([
      ['', '', 'B'],
      ['A', 'C', 'B-B', 'B-A'],
    ]);
  });

  it('renders data correctly', () => {
    tableComponent();

    const tbody = document.querySelector('tbody')!;
    const rows = tbody.querySelectorAll('tr');

    const result = [...rows].map((row) => {
      const cells = row.querySelectorAll('td');
      return [...cells].map((h) => h.textContent?.trim());
    });

    expect(result).toEqual([['1', '4', '3', '2']]);
  });
});

describe('Table reflects the data correctly (real data)', () => {
  const mockSetTable = jest.fn();
  const mockPagination = { pageIndex: 0, pageSize: 10 };
  const mockSetPagination = jest.fn();

  const tableComponent = (visibleColumns = ['key', 'sku']) =>
    render(
      <TanstackTable
        data={expected}
        columns={mockColumns}
        visibleColumns={visibleColumns}
        columnOrder={['a', 'c', 'b.b-b']}
        setTable={mockSetTable}
        pinnedColumns={[]}
        pagination={mockPagination}
        setPagination={mockSetPagination}
      />
    );

  it('sorts data correctly', async () => {
    tableComponent();
    const getFirstRowValue = () => screen.getAllByRole('cell')[0].textContent;

    expect(getFirstRowValue()).toEqual('112180103');

    const sortingBtn = screen.getByTestId('sorting-key');
    expect(sortingBtn).toBeVisible();

    //ascending
    fireEvent.click(sortingBtn);

    //0_key => column 'key', row 0
    expect(getFirstRowValue()).toEqual('110192064');

    //descending
    fireEvent.click(sortingBtn);

    expect(getFirstRowValue()).toEqual('160001076');

    //default
    fireEvent.click(sortingBtn);
    expect(getFirstRowValue()).toEqual('112180103');
  });

  it('filters by column correctly', async () => {
    tableComponent(['productType.key']);

    const filterButton = screen.getByTestId('column-filter-productType.key');
    expect(filterButton).toBeVisible();

    await act(async () => {
      fireEvent.click(filterButton);
    });

    const checkBox = screen.getByRole('checkbox', { name: /60001/ });
    expect(checkBox).toBeVisible();
    fireEvent.click(checkBox);
    expect(checkBox).toBeChecked();

    //apply filter
    const applyButton = screen.getByRole('button', { name: 'Apply' });
    expect(applyButton).toBeVisible();
    fireEvent.click(applyButton);

    //check if are only 3 results
    const rows = document.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(3);
  });
});
