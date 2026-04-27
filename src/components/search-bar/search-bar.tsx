import { Button, Input } from '@headlessui/react';
import { SearchIcon } from '@commercetools-uikit/icons';
import { CloseIcon } from '@commercetools-uikit/icons';
import { useEffect, useState } from 'react';

type SearchBarProps = {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
};

const SearchBar = ({ value, onChange, onSubmit }: SearchBarProps) => {
  const [currentValue, setCurrentValue] = useState<string>('');

  const handleSubmit = () => {
    // your real search function here
    if (onSubmit) onSubmit(currentValue);
  };

  const handleChange = (value: string) => {
    setCurrentValue(value);
    if (onChange) onChange(value);
  };

  useEffect(() => {
    setCurrentValue(value ?? '');
  }, [value]);

  return (
    <div className="flex items-center border border-[#c3c5d5] rounded-sm min-h-10 gap-1 pr-4 focus-within:border-blue-500 focus-within:border focus-within:ring-1 w-full justify-between">
      <Button type="submit" className="ml-4" onClick={handleSubmit}>
        <SearchIcon color="neutral60" size="40" />
      </Button>
      <Input
        className="h-full w-full border-0 outline-none focus:ring-0"
        value={currentValue}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
      {currentValue && currentValue != '' && (
        <Button onClick={() => handleSubmit('')}>
          <CloseIcon color="neutral60" size="20" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
