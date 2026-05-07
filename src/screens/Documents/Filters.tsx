import { useEffect } from 'react';
import FiltersComponent from '../../components/filters/filters';
import { FilterSubmitCallbackProps } from '../../types/filter';
import {
  changeLanguagesShown,
  getEnglishOption,
} from '../helpers/common-filters';
import { useTableContext } from './context';

type FiltersProps = {
  languages: string[];
  defaultAssets: { key: string; label: string }[];
};

const Filters = ({ languages, defaultAssets }: FiltersProps) => {
  //filters states
  const {
    state: {
      appliedFilters,
      filtersConfig,
      visibleColumns,
      selectedLanguages,
      columns,
    },
    actions: {
      setAppliedFilters,
      setFiltersConfig,
      setVisibleColumns,
      setSelectedLanguages,
    },
  } = useTableContext();

  useEffect(() => {
    const languagesOptions = languages.map((lang) => ({
      label: lang,
      value: lang,
    }));

    const assetsOptions = defaultAssets.map((asset) => ({
      value: asset.key,
      label: asset.label,
    }));

    setFiltersConfig([
      {
        filterKey: 'languages',
        label: 'Languages',
        options: languagesOptions,
      },
      {
        filterKey: 'types',
        label: 'Document types',
        options: assetsOptions,
      },
    ]);

    //set all documents on by default
    const assetsFilters = handleFilterChange(
      'types',
      assetsOptions.map((asset) => asset.value)
    );

    filtersChanged(
      'types',
      assetsOptions.map((asset) => asset.value)
    );

    //set en on by default
    const languagesFilters = handleFilterChange('languages', ['en']);
    //filtersChanged('languages', ['en']);

    setAppliedFilters({ ...assetsFilters, ...languagesFilters });
  }, []);

  const changeActiveTypes = (selectedTypes: string[]) => {
    setVisibleColumns((prev) =>
      columns
        .map((col) => col.key)
        .filter(
          (col) =>
            !col.startsWith('assets.') ||
            selectedTypes.includes(col.split('.')[1])
        )
    );
  };

  const handleFilterChange = (key: string, selectedOptions: string[]) => {
    let selected = selectedOptions;
    let newAppliedFilters: Record<string, string[]> = {};
    switch (key) {
      case 'languages':
        if (selected.length === 0) {
          selected = ['en'];
        }
        changeLanguagesShown(selected, setSelectedLanguages);
        break;
      case 'types':
        changeActiveTypes(selectedOptions);
        break;
    }

    newAppliedFilters[key] = selected;

    return newAppliedFilters;
  };

  const filtersChanged: FilterSubmitCallbackProps = (key, selectedOptions) => {
    setAppliedFilters({
      ...appliedFilters,
      ...handleFilterChange(key, selectedOptions),
    });
  };

  const clearAllFilters = () => {
    filtersConfig.forEach((config) => {
      switch (config.filterKey) {
        case 'languages':
          const enOption = getEnglishOption(filtersConfig);
          changeLanguagesShown(
            enOption ? [enOption.value] : [],
            setSelectedLanguages
          );
          break;
        case 'types':
          changeActiveTypes([]);
          break;
      }
    });
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
