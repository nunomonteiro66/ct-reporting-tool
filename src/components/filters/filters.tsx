import SelectInput from "@commercetools-uikit/select-input";
import UIFilters, {
  TAppliedFilter,
  TFilterConfiguration,
} from "@commercetools-uikit/filters";
import { useState } from "react";
import PrimaryButton from "@commercetools-uikit/primary-button";
import SecondaryButton from "@commercetools-uikit/secondary-button";

type OptionProps = { value: string; label: string };
type SubmitCallbackProps = (
  key: string,
  selectedOptions: OptionProps[]
) => void;
type ClearCallbackProps = (key: string) => void;

export type FiltersProps = {
  filterKey: string;
  label: string;
  options: OptionProps[];
};

const Filters = ({
  appliedFilters,
  filtersConfig,
  submitCallback,
}: {
  appliedFilters: TAppliedFilter[];
  filtersConfig: FiltersProps[];
  submitCallback: (key: string, selectedOptions: OptionProps[]) => void;
}) => {
  const [pendingSelections, setPendingSelections] = useState<
    Record<string, string[]>
  >({});

  const getAppliedValues = (key: string): OptionProps[] =>
    (appliedFilters.find((f) => f.filterKey === key)
      ?.values as OptionProps[]) || [];

  const getPendingSelected = (key: string): string[] =>
    pendingSelections[key] ?? getAppliedValues(key).map((o) => o.value);

  const onClearCallback: ClearCallbackProps = (key) => {
    setPendingSelections((prev) => ({ ...prev, [key]: [] }));
    submitCallback(key, []);
  };

  const filters: TFilterConfiguration[] = filtersConfig.map((config) => {
    const selected = getPendingSelected(config.filterKey);

    const setSelected = (values: string[]) =>
      setPendingSelections((prev) => ({ ...prev, [config.filterKey]: values }));

    const onSubmit = () => {
      const selectedOptions = config.options.filter((opt) =>
        selected.includes(opt.value)
      );
      submitCallback(config.filterKey, selectedOptions);
    };

    const applyAll = () => {
      const allOptionValues = config.options.map((opt) => opt.value);
      setSelected(allOptionValues);
      const allSelectedOptions = config.options;
      submitCallback(config.filterKey, allSelectedOptions);
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
            isMulti={true}
          />
        ),
        onClearRequest: () => onClearCallback(config.filterKey),
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
      onClearAllRequest={() => console.log("Clear all filters")}
      appliedFilters={appliedFilters}
      renderSearchComponent={<></>}
    />
  );
};

export default Filters;
