import SelectInput from '@commercetools-uikit/select-input';
import UIFilters, {
  TAppliedFilter,
  TFilterConfiguration,
} from '@commercetools-uikit/filters';
import { useState, useMemo, useEffect } from 'react';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';

type OptionProps = { value: string; label: string };

export type FiltersProps = {
  filterKey: string;
  label: string;
  options: OptionProps[];
};

const Filters = ({
  appliedFilters,
  filtersConfig,
  submitCallback,
  clearAllCallback,
}: {
  appliedFilters: TAppliedFilter[];
  filtersConfig: FiltersProps[];
  submitCallback: (key: string, selectedOptions: OptionProps[]) => void;
  clearAllCallback: () => void;
}) => {
  const [pendingSelections, setPendingSelections] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    const initialState: Record<string, string[]> = {};

    appliedFilters.forEach((filter) => {
      initialState[filter.filterKey] =
        (filter.values as OptionProps[]).map((v) => v.value) || [];
    });

    setPendingSelections(initialState);
  }, [appliedFilters]);

  const filters: TFilterConfiguration[] = useMemo(() => {
    return filtersConfig.map((config) => {
      const selected = pendingSelections[config.filterKey] || [];

      const setSelected = (values: string[]) =>
        setPendingSelections((prev) => ({
          ...prev,
          [config.filterKey]: values,
        }));

      const onSubmit = () => {
        const selectedOptions = config.options.filter((opt) =>
          selected.includes(opt.value)
        );
        submitCallback(config.filterKey, selectedOptions);
      };

      const applyAll = () => {
        const allValues = config.options.map((opt) => opt.value);
        setSelected(allValues);
        submitCallback(config.filterKey, config.options);
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
  }, [filtersConfig, pendingSelections, submitCallback]);

  return (
    <UIFilters
      filters={filters}
      appliedFilters={appliedFilters}
      onClearAllRequest={() => {
        setPendingSelections({});
        clearAllCallback();
      }}
      renderSearchComponent={null}
    />
  );
};

export default Filters;
