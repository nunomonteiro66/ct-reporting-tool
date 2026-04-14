export type Attribute = {
  label: string;
  value: string;
};

type LabelLocale = {
  locale: string;
  value: string;
};

export type AttributeComplete = {
  value: string;
  label: string | string[]; //in case we want the label to be in several lines
  type: string;
  label_locales: LabelLocale[];
};
