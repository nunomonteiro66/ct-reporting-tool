import { useEffect, useRef, useState } from 'react';
import { useProductsAPI } from '../../hooks/use-products-connector';
import ProductsTable from '../datatable/products-table';
import { mapCTProductResultToExport } from '../../utils/mapping';
import { usePaginationState } from '@commercetools-uikit/hooks';
import { TProduct } from '../../types/product';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { CSVLink, CSVDownload } from 'react-csv';
import TanstackTable from '../tanstack-table/tanstack-table';
import SortableList from '../sortable-list/sortable-list';

type Data = {
  name: string;
  lastName: string;
};

const Materials = () => {
  const data = [
    {
      name: 'Name',
      lastName: 'Henry',
    },
  ];

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'lastName', label: 'Last Name' },
  ];

  const [items, setItems] = useState({
    hidden: [{ key: '1', label: 'asd' }],
    visible: ['D', 'E'],
  });

  const activeColumns = ['name'];

  return (
    <>
      <TanstackTable
        data={data}
        columns={columns}
        visibleColumns={activeColumns}
      />
    </>
  );
};

Materials.displayName = 'MaterialDetails';

export default Materials;
