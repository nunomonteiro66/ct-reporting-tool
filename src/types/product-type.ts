import { Attribute } from "./attribute";

export type ProductType = {
  product_type_name: string;
  product_type_value: string;
  attributes: Attribute[];
};
