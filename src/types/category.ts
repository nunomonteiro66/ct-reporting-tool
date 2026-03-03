import { TCategory } from "./generated/ctp";

type AncestorName = Pick<TCategory, "name">;

export type CategoryNames = Pick<TCategory, "id" | "name"> & {
  ancestors: AncestorName[];
};
