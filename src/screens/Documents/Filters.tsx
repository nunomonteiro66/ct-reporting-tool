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
    filtersChanged('types', assetsOptions);

    //set en on by default
    const defaultEn = languagesOptions.filter((lang) => lang.value === 'en');
    if (defaultEn) filtersChanged('languages', defaultEn);
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

  const filtersChanged: FilterSubmitCallbackProps = (key, selectedOptions) => {
    let selected = selectedOptions;
    switch (key) {
      case 'languages':
        if (selected.length === 0) {
          const enOption = getEnglishOption(filtersConfig);
          if (enOption) selected = [enOption];
        }
        changeLanguagesShown(
          selected.map((opt) => opt.value),
          setSelectedLanguages
        );
        break;
      case 'types':
        changeActiveTypes(selectedOptions.map((opt) => opt.value));
    }

    setAppliedFilters((prev) => [
      ...prev.filter((f) => f.filterKey !== key),
      { filterKey: key, values: selectedOptions },
    ]);
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

    setAppliedFilters(
      filtersConfig.map((config) => {
        if (config.filterKey === 'languages') {
          const enOption = getEnglishOption(filtersConfig);
          return {
            filterKey: config.filterKey,
            values: enOption ? [enOption] : [],
          };
        }
        return { filterKey: config.filterKey, values: [] };
      })
    );
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
