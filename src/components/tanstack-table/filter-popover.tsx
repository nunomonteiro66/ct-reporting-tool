import { useEffect, useRef, useState } from 'react';
import CustomDropdown from './custom-dropdown';
import s from './styles.module.css';

type FilterPopoverProps = {
  columnKey: string;
  options: string[];
  activeFilters: string[];
  onSubmit: (columnKey: string, values: string[]) => void;
  onClose: () => void;
};

const FilterPopover = ({
  columnKey,
  options,
  activeFilters,
  onSubmit,
  onClose,
}: FilterPopoverProps) => {
  const [draft, setDraft] = useState<string[]>(activeFilters);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const handleSubmit = () => {
    onSubmit(columnKey, draft);
    onClose();
  };

  return (
    <div ref={ref} className={s.popoverContainer}>
      <div className={s.popoverHeader}>
        <span className={s.popoverTitle}>Filter</span>
        {draft.length > 0 && (
          <button onClick={() => setDraft([])} className={s.popoverClearBtn}>
            Clear
          </button>
        )}
      </div>
      <CustomDropdown options={options} selected={draft} onChange={setDraft} />
      <div className={s.popoverFooter}>
        <button onClick={onClose} className={s.cancelBtn}>
          Cancel
        </button>
        <button onClick={handleSubmit} className={s.submitBtn}>
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterPopover;
