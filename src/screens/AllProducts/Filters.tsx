import { useEffect } from 'react';
import FiltersComponent from '../../components/filters/filters';
import { Category } from '../../types/category';
import { useTableContext } from './context';
import { AttributeComplete } from '../../types/attribute';
import { changeLanguagesShown } from '../helpers/common-filters';

type SubmitCallbackProps = (key: string, selectedOptions: string[]) => void;

type FiltersProps = {
  categories: Category[];
  languages: string[];
  uniqueAttributes: AttributeComplete[];
};

const Filters = ({ categories, languages, uniqueAttributes }: FiltersProps) => {
  const {
    state: { appliedFilters, filtersConfig, visibleColumns, table },
    actions: {
      setAppliedFilters,
      setFiltersConfig,
      setVisibleColumns,
      setSelectedLanguages,
    },
  } = useTableContext();

  useEffect(() => {
    //set the options for the filters
    const languagesOptions = languages.map((lang) => ({
      label: lang,
      value: lang,
    }));

    setFiltersConfig([
      {
        filterKey: 'attributes',
        label: 'Attributes',
        options: uniqueAttributes.map((attr) => ({
          value: Array.isArray(attr.value) ? attr.value.join('\n') : attr.value,
          label: Array.isArray(attr.label)
            ? `${attr.label[0]} (${attr.label[1]})`
            : attr.label,
        })),
      },
      {
        filterKey: 'languages',
        label: 'Languages',
        options: languagesOptions,
      },
      {
        filterKey: 'categories',
        label: 'Categories',
        options: categories.map((cat) => ({
          label: cat.name ?? '',
          value: cat.key ?? '',
        })),
      },
    ]);

    if (appliedFilters) {
      Object.entries(appliedFilters).forEach(([key, values]) => {
        filtersChanged(key, values);
      }, []);
    }

    const defaultOptions = ['en'];
    filtersChanged('languages', defaultOptions);
  }, []);

  const changeDataByCategory = (appliedCategories: string[]) => {
    //table needs the full shown name (as shown in the cells)
    const newCategories = categories
      .filter((cat) => appliedCategories.includes(cat.key ?? ''))
      .map((cat) => cat.name);

    //filter the data by category (change the column filter)
    table?.setColumnFilters((prev) => [
      ...prev,
      { id: 'categories', value: newCategories },
    ]);
  };

  //when the attributes filters change, replace the active columns
  const changeAttributesShown = (selectedAttributes: string[]) => {
    //remove all attributes columns from active columns
    let newActiveColumns = visibleColumns.filter(
      (col) => !col.startsWith('attributes.')
    );

    newActiveColumns = [
      ...newActiveColumns,
      ...selectedAttributes.flatMap((opt) => [`attributes.${opt}`]),
    ];

    setVisibleColumns(newActiveColumns);
  };

  const changeAttributesByCategory = (selectedOptions: string[]) => {
    //get the categories
    const selectedCategories = categories.filter((cat) =>
      selectedOptions.includes(cat.key ?? '')
    );

    const newAttributesKeys = [
      ...new Set(
        selectedCategories.flatMap((cat) => cat.facetAttributeKeys ?? [])
      ),
    ];

    return newAttributesKeys;
  };

  const handleFilterChange = (key: string, selectedOptions: string[]) => {
    let selected = selectedOptions;
    let newAppliedFilters: Record<string, string[]> = {};
    switch (key) {
      case 'attributes':
        changeAttributesShown(selected);
        break;
      case 'languages':
        if (selected.length === 0) {
          selected = ['en'];
        }
        changeLanguagesShown(selected, setSelectedLanguages);
        break;
      case 'categories':
        const newAttributes = changeAttributesByCategory(selected);
        changeAttributesShown(newAttributes);
        newAppliedFilters['attributes'] = newAttributes;

        //set column filter for the data
        changeDataByCategory(selected);

        break;
    }

    newAppliedFilters[key] = selected;

    return newAppliedFilters;
  };

  const filtersChanged: SubmitCallbackProps = (key, selectedOptions) => {
    setAppliedFilters({
      ...appliedFilters,
      ...handleFilterChange(key, selectedOptions),
    });
  };

  const clearAllFilters = () => {
    const newFilters = filtersConfig.reduce(
      (acc, filter) => ({
        ...acc,
        ...handleFilterChange(filter.filterKey, []),
      }),
      {} as Record<string, string[]>
    );

    setAppliedFilters(newFilters);
  };

  return (
    <FiltersComponent
      appliedFilters={appliedFilters}
      filtersConfig={filtersConfig}
      submitCallback={filtersChanged}
      clearAllCallback={clearAllFilters}
    />
  );
};

export default Filters;
