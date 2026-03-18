import { useEffect, useRef, useState } from 'react';
import CustomDropdown from './custom-dropdown';
import ReactDOM from 'react-dom';

type FilterPopoverProps = {
  columnKey: string;
  options: string[];
  activeFilters: string[];
  onSubmit: (columnKey: string, values: string[]) => void;
  onClose: () => void;
  anchorEl: HTMLElement | null;
};

const FilterPopover = ({
  columnKey,
  options,
  activeFilters,
  onSubmit,
  onClose,
  anchorEl,
}: FilterPopoverProps) => {
  const [draft, setDraft] = useState<string[]>(activeFilters);
  const ref = useRef<HTMLDivElement>(null);

  // Position state
  const getPos = () => {
    if (!anchorEl) return { top: 0, left: 0 };
    const rect = anchorEl.getBoundingClientRect();
    const popoverWidth = 180; // min-w-[180px]

    const left =
      rect.left + popoverWidth > window.innerWidth
        ? rect.right - popoverWidth - 12 // flip to the left
        : rect.left;

    return {
      top: rect.bottom + 4,
      left,
    };
  };
  const [pos] = useState(getPos);

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

  return ReactDOM.createPortal(
    <div
      ref={ref}
      style={{ top: pos.top, left: pos.left }}
      className="fixed z-9999 bg-white border border-[#e2e8f0] rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.1)] w-55 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-2 pb-1 border-b border-[#f1f5f9]">
        <span className="text-[11px] font-semibold tracking-[0.05em] uppercase text-[#64748b]">
          Filter
        </span>
        {draft.length > 0 && (
          <button
            onClick={() => setDraft([])}
            className="text-[11px] text-blue-500 bg-none border-none cursor-pointer p-0 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      <CustomDropdown options={options} selected={draft} onChange={setDraft} />

      {/* Footer */}
      <div className="flex gap-1.5 px-3 py-2 border-t border-[#f1f5f9] justify-end">
        <button
          onClick={onClose}
          className="text-[12px] px-2.5 py-1 border border-[#e2e8f0] rounded bg-white text-[#64748b] cursor-pointer hover:bg-[#f8fafc]"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="text-[12px] px-2.5 py-1 border-none rounded bg-blue-500 text-white cursor-pointer font-semibold hover:bg-blue-600"
        >
          Apply
        </button>
      </div>
    </div>,
    document.body
  );
};

export default FilterPopover;
