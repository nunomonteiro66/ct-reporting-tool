import { TProduct } from './product';

export type MappedProduct = Partial<TProduct> & {
  id: string;
  sku?: string;
  attributes: Record<string, unknown>; // or refine if you know it
  image: 'Yes' | 'No';
  categories: string[];
  selections: string[];
  dop: string;
  epd: string;
  datasheet: string;
};
