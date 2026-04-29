import { render } from '@testing-library/react';
import { TableProvider, useTableContext } from '../context';
import CustomDataTable from '../../../components/tanstack-table/custom-data-table';
import { expected } from '../../../../test-data/mapped';
import { IntlProvider } from 'react-intl';
import { TableState } from '../../../types/table-context';
import { MappedProduct } from '../../../types/mapped-product';
import { mockColumns } from '../../../../test-data/columns';
import fs from 'fs';
import Filters from '../Filters';

describe('All Products Tests', () => {
  const Render = (initialState?: Partial<TableState<MappedProduct>>) => {
    const Component = () => {
      const {} = useTableContext();
      return <CustomDataTable data={expected} useContext={useTableContext} />;
    };
    return render(
      <IntlProvider locale="en">
        <TableProvider initialState={initialState}>
          <Filters categories={[]} languages={[]} uniqueAttributes={[]} />
          <Component />
        </TableProvider>
      </IntlProvider>
    );
  };

  it('Renders', () => {
    const initialState: Partial<TableState<MappedProduct>> = {
      appliedFilters: [
        {
          filterKey: 'categories',
          values: [{ label: '', value: 'lv-buildingWires' }],
        },
      ],
      columns: mockColumns,
    };
    const { container } = Render(initialState);

    const thead = document.querySelector('thead')!;
    const rows = thead.querySelectorAll('tr');

    const result = [...rows].map((row) => {
      const headers = row.querySelectorAll('th');
      return [...headers].map((h) => h.textContent?.trim());
    });

    fs.writeFileSync(
      'test-output.html',
      `<html><body>${container.innerHTML}</body></html>`
    );
  });
});
