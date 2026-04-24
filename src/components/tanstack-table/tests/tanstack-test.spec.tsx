import { render, screen } from '@testing-library/react';
import TanstackTable from '../tanstack-table';

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

  const tableComponent = () =>
    render(
      <TanstackTable
        data={mockData}
        columns={mockColumns}
        visibleColumns={['a', 'b.b-a', 'b.b-b', 'c']}
        columnOrder={['a', 'c', 'b.b-b']}
        setTable={mockSetTable}
        globalFilter=""
        pinnedColumns={[]}
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
