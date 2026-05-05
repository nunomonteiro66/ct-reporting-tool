export type ImageProduct = {
  sku: string | null | undefined;
  type: string;
  product_type_key: string | null | undefined;
  product_type_name: string | undefined;
  categories: (string | null | undefined)[] | undefined;
  images: {
    name: string;
    link: string;
    order: number;
  }[];
};
