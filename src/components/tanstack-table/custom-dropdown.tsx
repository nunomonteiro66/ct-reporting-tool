import { Input } from '@headlessui/react';
import SearchTextInput from '@commercetools-uikit/search-text-input';
import { useEffect, useState } from 'react';

type CustomDropdownProps = {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
};

/**
 * Replace this component with your own dropdown implementation.
 * Props:
 *   - options:  all unique values for this column (derived from full dataset)
 *   - selected: the currently checked values (draft state, not yet applied)
 *   - onChange: call with the new array of selected values on each change
 */
const CustomDropdown = ({
  options,
  selected,
  onChange,
}: CustomDropdownProps) => {
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    setCurrentOptions(options);
  }, [options]);

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  };

  const search = (value: string) => {
    setSearchTerm(value);
    setCurrentOptions(
      options.filter((opt) => opt.toLowerCase().includes(value.toLowerCase()))
    );
  };

  return (
    <div className="flex flex-col gap-0.5 max-h-50 overflow-y-auto py-1">
      <SearchTextInput
        placeholder="Search"
        value={searchTerm}
        onChange={(event) => search(event.target.value)}
        onSubmit={() => {}}
        onReset={() => {
          setCurrentOptions(options);
        }}
        isCondensed
      />
      {currentOptions.map((opt) => (
        <label
          key={opt}
          className="flex items-center px-3 py-1.25 text-[13px] text-[#334155] cursor-pointer rounded hover:bg-[#f0f5ff] whitespace-nowrap"
        >
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
            className="mr-1.5 accent-blue-500"
          />
          {opt}
        </label>
      ))}
    </div>
  );
};

export default CustomDropdown;
