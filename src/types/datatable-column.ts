import { ReactElement } from 'react';
import { TRow } from '@commercetools-uikit/data-table';

export type Column = {
  label: string;
  key: string;
  isSortable?: boolean;
  renderItem?: (row: TRow) => ReactElement;
  isVisible?: boolean;
  children?: Column[];
  disableFilter?: boolean;
};
