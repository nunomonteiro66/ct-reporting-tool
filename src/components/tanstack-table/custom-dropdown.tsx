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
  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  };

  return (
    <div className="flex flex-col gap-0.5 max-h-[200px] overflow-y-auto py-1">
      {options.map((opt) => (
        <label
          key={opt}
          className="flex items-center px-3 py-[5px] text-[13px] text-[#334155] cursor-pointer rounded hover:bg-[#f0f5ff] whitespace-nowrap"
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
