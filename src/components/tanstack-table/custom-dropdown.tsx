import s from './styles.module.css';

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
    <div className={s.dropdownList}>
      {options.map((opt) => (
        <label key={opt} className={s.dropdownOption}>
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
          />
          {opt}
        </label>
      ))}
    </div>
  );
};

export default CustomDropdown;
