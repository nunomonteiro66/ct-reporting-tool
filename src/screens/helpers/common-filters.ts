import { FiltersProps } from '../../components/filters/filters';

//only keep children with the selected languages
export const changeLanguagesShown = (
  langs: string[],
  setSelectedLanguages: (values: string[]) => void
) => {
  //no language selected, set english as default
  if (langs.length === 0) {
    setSelectedLanguages(['en']);
  } else {
    setSelectedLanguages(langs);
  }
};

export const getEnglishOption = (filtersConfig: FiltersProps[]) =>
  filtersConfig
    .find((filter) => filter.filterKey === 'languages')
    ?.options.find((opt) => opt.value === 'en');
