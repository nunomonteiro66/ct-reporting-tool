import { TSecondaryButtonProps } from '@commercetools-uikit/secondary-button';
import DropdownMenu from '@commercetools-uikit/dropdown-menu';
import IconButton from '@commercetools-uikit/icon-button';

type DropdownOption = {
  value: string;
  label: string;
};

type DropdownProps = {
  icon: TSecondaryButtonProps['iconLeft'];
  options: DropdownOption[];
  onSelectCallback: (value: string) => void;
  label?: string;
};

const Dropdown = ({
  icon,
  options,
  onSelectCallback,
  label = 'dropdown',
}: DropdownProps) => {
  return (
    <DropdownMenu triggerElement={<IconButton icon={icon} label={label} />}>
      {options.map((opt, index) => (
        <div className="dropdown-item">
          <DropdownMenu.ListMenuItem
            key={`dropdown-option-${index}`}
            onClick={() => onSelectCallback(opt.value)}
          >
            {opt.label}
          </DropdownMenu.ListMenuItem>
        </div>
      ))}
    </DropdownMenu>
  );
};

export default Dropdown;
