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
  label: string[]; //label has name and code (Type (7_type) )
  type: string;
  label_locales: LabelLocale[];
};
