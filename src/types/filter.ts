type OptionProps = { value: string; label: string };

export type FilterSubmitCallbackProps = (
  key: string,
  selectedOptions: OptionProps[]
) => void;
