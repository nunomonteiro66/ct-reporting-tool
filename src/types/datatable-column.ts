import { ReactElement } from "react";
import { TRow } from "@commercetools-uikit/data-table";

export type Column = {
  label: string | string[];
  key: string;
  isSortable?: boolean;
  renderItem?: (row: TRow) => ReactElement;
  isVisible?: boolean
};
