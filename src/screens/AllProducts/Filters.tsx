import { useEffect } from 'react';
import FiltersComponent from '../../components/filters/filters';
import { Category } from '../../types/category';
import { useTableContext } from './context';
import { AttributeComplete } from '../../types/attribute';

type OptionProps = { value: string; label: string };

type SubmitCallbackProps = (
  key: string,
  selectedOptions: OptionProps[]
) => void;

type FiltersProps = {
  categories: Category[];
  languages: string[];
  uniqueAttributes: AttributeComplete[];
};

const Filters = ({ categories, languages, uniqueAttributes }: FiltersProps) => {
  const {
    state: { appliedFilters, filtersConfig, visibleColumns, selectedLanguages },
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
          label:
            (cat.parent ? `${cat.parent.name} > ${cat.name}` : cat.name) ?? '',
          value: cat.key ?? '',
        })),
      },
    ]);

    const defaultOptions = languagesOptions.filter((lang) =>
      selectedLanguages.includes(lang.value)
    );
    if (defaultOptions) filtersChanged('languages', defaultOptions);
  }, []);

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

  //only keep children with the selected languages
  const changeLanguagesShown = (langs: string[]) => {
    //no language selected, set english as default
    if (langs.length === 0) {
      setSelectedLanguages(['en']);
    } else {
      setSelectedLanguages(langs);
    }
  };

  const getEnglishOption = () =>
    filtersConfig
      .find((filter) => filter.filterKey === 'languages')
      ?.options.find((opt) => opt.value === 'en');

  const changeAttributesByCategory = (selectedOptions: OptionProps[]) => {
    const keys = selectedOptions.map((opt) => opt.value);

    //get the categories
    const selectedCategories = categories.filter((cat) =>
      keys.includes(cat.key ?? '')
    );

    const newAttributesKeys = [
      ...new Set(
        selectedCategories.flatMap((cat) => cat.facetAttributeKeys ?? [])
      ),
    ];

    changeAttributesShown(newAttributesKeys);
  };

  const filtersChanged: SubmitCallbackProps = (key, selectedOptions) => {
    let selected = selectedOptions;
    switch (key) {
      case 'attributes':
        changeAttributesShown(selected.map((opt) => opt.value));
        break;
      case 'languages':
        if (selected.length === 0) {
          const enOption = getEnglishOption();
          if (enOption) selected = [enOption];
        }
        changeLanguagesShown(selected.map((opt) => opt.value));
        break;
      case 'categories':
        changeAttributesByCategory(selected);
        break;
    }

    const newAppliedFilters = [
      ...appliedFilters.filter((f) => f.filterKey !== key),
      { filterKey: key, values: selected },
    ];

    setAppliedFilters(newAppliedFilters);
  };

  const clearAllFilters = () => {
    filtersConfig.forEach((config) => {
      // still need to trigger the side effects (changeAttributesShown, etc.)
      switch (config.filterKey) {
        case 'attributes':
          changeAttributesShown([]);
          break;
        case 'languages':
          const enOption = getEnglishOption();
          changeLanguagesShown(enOption ? [enOption.value] : []);
          break;
        case 'categories':
          changeAttributesByCategory([]);
          break;
      }
    });

    setAppliedFilters(
      filtersConfig.map((config) => {
        if (config.filterKey === 'languages') {
          const enOption = getEnglishOption();
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
