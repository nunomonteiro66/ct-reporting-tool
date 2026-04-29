import SelectInput from '@commercetools-uikit/select-input';
import UIFilters, {
  TAppliedFilter,
  TFilterConfiguration,
} from '@commercetools-uikit/filters';
import { useState, useMemo, useEffect, Dispatch, SetStateAction } from 'react';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import { TAppliedFilterValue } from '@commercetools-uikit/filters/dist/declarations/src/filter-menu';

type OptionProps = { value: string; label: string };

export type FiltersProps = {
  filterKey: string;
  label: string;
  options: OptionProps[];
};

const FiltersComponent = ({
  appliedFilters,
  filtersConfig,
  submitCallback,
  clearAllCallback,
}: {
  appliedFilters: Record<string, string[]>;
  filtersConfig: FiltersProps[];
  submitCallback: (key: string, selectedOptions: string[]) => void;
  clearAllCallback: () => void;
}) => {
  //checked boxes (pending of apply)
  const [pendingSelections, setPendingSelections] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    setPendingSelections({ ...appliedFilters });
  }, [appliedFilters]);

  //applied filters converted to the CT filter component
  const ctAppliedFilters: TAppliedFilter[] = Object.entries(appliedFilters).map(
    ([key, values]) => {
      const ctValues = filtersConfig
        .find((config) => config.filterKey === key)
        ?.options.filter((opt) => values.includes(opt.value));

      return { filterKey: key, values: ctValues ?? [] };
    }
  );

  useEffect(() => {}, [ctAppliedFilters]);

  const filters: TFilterConfiguration[] = filtersConfig.map((config) => {
    const selected = pendingSelections[config.filterKey] || [];

    const setSelected = (values: string[]) => {
      setPendingSelections((prev) => ({
        ...prev,
        [config.filterKey]: values,
      }));
    };

    const onSubmit = () => {
      submitCallback(config.filterKey, selected);
    };

    const applyAll = () => {
      const allValues = config.options.map((opt) => opt.value);
      setSelected(allValues);
      submitCallback(config.filterKey, allValues);
    };

    const onClear = () => {
      setSelected([]);
      submitCallback(config.filterKey, []);
    };

    return {
      key: config.filterKey,
      label: config.label,
      filterMenuConfiguration: {
        renderMenuBody: () => (
          <SelectInput
            value={selected}
            appearance="filter"
            options={config.options}
            optionStyle="checkbox"
            onChange={(e) => setSelected(e.target.value as string[])}
            isMulti
            onFocus={() => setSelected(appliedFilters[config.filterKey])}
            controlShouldRenderValue
          />
        ),
        onClearRequest: onClear,
        renderApplyButton: () => (
          <div className="flex gap-4">
            <PrimaryButton label="Apply" onClick={onSubmit} />
            <SecondaryButton label="Apply All" onClick={applyAll} />
          </div>
        ),
      },
    };
  });

  return (
    <UIFilters
      filters={filters}
      appliedFilters={ctAppliedFilters}
      onClearAllRequest={() => {
        setPendingSelections({});
        clearAllCallback();
      }}
      renderSearchComponent={null}
    />
  );
};

export default FiltersComponent;
