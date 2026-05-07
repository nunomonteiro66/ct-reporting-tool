import PrimaryButton from '@commercetools-uikit/primary-button';
import DataPageLayout from '../../layouts/data-page-layout';
import Filters from '../AllProducts/Filters';
import CustomDataTable from '../../components/tanstack-table/custom-data-table';
import { useTableContext } from '../AllProducts/context';
import { useEffect } from 'react';
import { flattenColumns } from '../../utils/flatten-columns';
import FiltersComponent from '../../components/filters/filters';
import { ImageProduct } from '../../types/images';
import { imagesSample } from '../Images/tests/images-sample';

const buildExtraColumns = (data: ImageProduct[]) => {
  const len = data.length
    ? Math.max(...data.map((map) => Object.keys(map.images).length))
    : 0;
  return Array.from({ length: len }, (_, i) => [
    { key: `images.${i}.name`, label: `Image ${i + 1}` },
    { key: `images.${i}.link`, label: `Image ${i + 1} link` },
  ]).flat();
};

const TestC = () => {
  const {
    actions: { setColumns, setVisibleColumns, setSelectedLanguages },
  } = useTableContext();

  const data = imagesSample;

  const cols = [{ key: 'sku', label: 'sku' }, ...buildExtraColumns(data)];

  useEffect(() => {
    //setColumns(mockColumns);
    //setVisibleColumns(mockColumns.map((col) => col.key));
    setColumns(cols);
    console.log('COLUMNS: ', cols);
    //setVisibleColumns(cols.map((col) => col.key));
    setVisibleColumns(cols.map((col) => col.key));

    setSelectedLanguages(['en', 'sv']);
  }, []);

  const filterConfig = [
    {
      filterKey: '1',
      label: '1',
      options: [
        {
          value: '1',
          label: '1',
        },
        {
          value: '2',
          label: '2',
        },
        {
          value: '3',
          label: '3',
        },
      ],
    },
    {
      filterKey: '2',
      label: '2',
      options: [
        {
          value: '1',
          label: '1',
        },
        {
          value: '2',
          label: '2',
        },
        {
          value: '3',
          label: '3',
        },
      ],
    },
  ];

  return (
    <>
      {/* <Filters
        categories={categories ?? []}
        languages={languages}
        uniqueAttributes={uniqueAttributes}
      /> */}
      <FiltersComponent
        filtersConfig={filterConfig}
        appliedFilters={{ '1': ['1'] }}
        clearAllCallback={() => {}}
        submitCallback={() => {}}
      />
      <CustomDataTable data={data} useContext={useTableContext} />
    </>
  );
};

export default TestC;
