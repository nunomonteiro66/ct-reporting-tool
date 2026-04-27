import { Field, Switch as HeadlessuiSwitch, Label } from '@headlessui/react';
import { Dispatch, SetStateAction, useState } from 'react';

type SwitchProps = {
  label: string;
  enabled?: boolean;
  onChange: (value: boolean) => void;
};

const Switch = ({ label, enabled, onChange }: SwitchProps) => {
  const [isEnabled, setIsEnabled] = useState(enabled ?? false);

  return (
    <Field className="flex items-center justify-between gap-3">
      <Label className="w-max text-[14px]">{label}</Label>
      <HeadlessuiSwitch
        checked={isEnabled}
        onChange={(value) => {
          setIsEnabled(value);
          onChange(value);
        }}
        className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-checked:bg-blue-600"
      >
        <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
      </HeadlessuiSwitch>
    </Field>
  );
};

export default Switch;
