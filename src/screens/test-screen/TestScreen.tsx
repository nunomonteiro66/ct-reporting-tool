import PrimaryButton from '@commercetools-uikit/primary-button';
import DataPageLayout from '../../layouts/data-page-layout';
import Filters from '../AllProducts/Filters';
import CustomDataTable from '../../components/tanstack-table/custom-data-table';
import { useTableContext } from '../AllProducts/context';
import { useEffect } from 'react';
import { flattenColumns } from '../../utils/flatten-columns';
import { expected } from '../../../test-data/mapped';

const TestC = () => {
  const {
    actions: { setColumns, setVisibleColumns, setSelectedLanguages },
  } = useTableContext();

  const cols = [
    { key: 'key', label: 'key' },
    {
      key: 'sku',
      label: 'SKU',
    },
    { key: 'productType.key', label: 'Product Type Key' },
    { key: 'productType.name', label: 'Product Type Name' },
    { key: 'categories', label: 'Categories' },
    { key: 'selections', label: 'Product Selections' },
    { key: 'image', label: 'Image' },
    { key: 'epd', label: 'EPD' },
    { key: 'dop', label: 'DOP' },
    { key: 'doc', label: 'DOC' },
    { key: 'datasheet', label: 'Datasheet' },
    {
      key: 'names',
      label: 'Names',
      children: [
        { key: 'en', label: 'EN' },
        { key: 'sv', label: 'SV' },
      ],
    },
  ];

  const data = expected;

  useEffect(() => {
    //setColumns(mockColumns);
    //setVisibleColumns(mockColumns.map((col) => col.key));
    setColumns(cols);
    setVisibleColumns(cols.map((col) => col.key));

    setSelectedLanguages(['en', 'sv']);
  }, []);

  return (
    <>
      <CustomDataTable data={data} />
    </>
  );
};

export default TestC;
