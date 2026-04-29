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
          label: Array.isArray(attr.label) ? attr.label.join('\n') : attr.label,
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

  //if the column "categories changed in the column, change it also in here"
  /* useEffect(() => {
    const categoriesFilters = table
      ?.getState()
      .columnFilters.find((filter) => filter.id === 'categories');
    if (!categoriesFilters) return;

    console.log('Setting: ', categoriesFilters);

    setAppliedFilters((prev) => {
      prev['categories'] = categoriesFilters.value as string[];
      return prev;
    });
  }, [table?.getState().columnFilters]); */

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

    //table uses category names from both the parent and child
    /* const selectedCategoriesLabels = selectedCategories.map((cat) => cat.name);

    table?.setColumnFilters((prev) => {
      const existingCategoriesFilters = prev.find(
        (filter) => filter.id === 'categories'
      );
      if (existingCategoriesFilters) {
        (existingCategoriesFilters.value as Array<unknown>).push(
          selectedCategoriesLabels
        );
        return prev;
      }
      return [...prev, { id: 'categories', value: selectedCategoriesLabels }];
    }); */

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
