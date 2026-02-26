import { ReactElement } from "react";
import { TRow } from "@commercetools-uikit/data-table";

export type Column = {
  label: string;
  key: string;
  renderItem?: (row: TRow) => ReactElement;
};
