export type DocumentProduct = {
  sku: string | null | undefined;
  product_name: string | null | undefined;
  type: Record<string, unknown>;
  product_type_key: string | null | undefined;
  product_type_name: string | undefined;
  categories: (string | null | undefined)[] | undefined;
  assets: Record<string, Record<string, { name: string; link: string }>>;
  selections: string[];
  revision: string;
};
