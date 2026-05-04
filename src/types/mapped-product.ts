import { TProduct } from './generated/ctp';

export type MappedProduct = Partial<TProduct> & {
  id: string;
  sku?: string;
  names: Record<string, string>;
  descriptions: Record<string, string>;
  attributes: Record<string, Record<string, string>>;
  image: 'Yes' | 'No';
  categories: string[];
  selections: string[];
  dop: string;
  epd: string;
  datasheet: string;
};
