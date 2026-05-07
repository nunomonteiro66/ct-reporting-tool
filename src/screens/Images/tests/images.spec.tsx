import { fireEvent, render, screen } from '@testing-library/react';
import CustomDataTable from '../../../components/tanstack-table/custom-data-table';
import { ImageProduct } from '../../../types/images';
import { TableState } from '../../../types/table-context';
import { TableProvider, useTableContext } from '../context';
import { imagesSample } from './images-sample';
import { IntlProvider } from 'react-intl';
import preview from 'jest-preview';

const defaultColumns = [
  { key: 'key', label: 'Key' },
  {
    key: 'sku',
    label: 'SKU',
  },
  { key: 'product_name', label: 'Product Name' },
  { key: 'type', label: 'Type' },
  { key: 'product_type_key', label: 'Product Type Key' },
  { key: 'product_type_name', label: 'Product Type Name' },
  { key: 'categories', label: 'Product categories' },
  { key: 'selections', label: 'Product Selections' },
];

describe('Images screen tests', () => {
  const Render = (initialState?: Partial<TableState<ImageProduct>>) => {
    const Component = () => {
      const {} = useTableContext();
      return (
        <CustomDataTable data={imagesSample} useContext={useTableContext} />
      );
    };
    return render(
      <IntlProvider locale="en">
        <TableProvider initialState={initialState}>
          <Component />
        </TableProvider>
      </IntlProvider>
    );
  };

  it('Renders', () => {
    //build all the extra columns for the images
    const buildExtraColumns = (data: ImageProduct[]) => {
      const len = data.length
        ? Math.max(...data.map((map) => Object.keys(map.images).length))
        : 0;
      return Array.from({ length: len }, (_, i) => [
        { key: `images.${i}.name`, label: `Image ${i + 1}` },
        { key: `images.${i}.link`, label: `Image ${i + 1} link` },
      ]).flat();
    };

    const cols = [
      { key: 'sku', label: 'SKU' },
      ...buildExtraColumns(imagesSample),
    ];

    const initialState: Partial<TableState<ImageProduct>> = {
      columns: cols,
      visibleColumns: cols.map((col) => col.key),
    };

    Render(initialState);
    // Open http://localhost:3336 to see the preview

    const searchBar = screen.getByTestId('selectable-input');

    const dropdown = screen.getByTestId(
      'selectable-search-input-container'
    ).firstChild;

    fireEvent.click(dropdown);

    preview.debug();
  });
});
