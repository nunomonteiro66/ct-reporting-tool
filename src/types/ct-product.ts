type LocalizedString = Record<string, string>;

type CTAttribute = {
  name: string;
  value: any;
};

type CTVariant = {
  sku: string;
  attributes: CTAttribute[];
  images?: { url: string }[];
};

/* export type CTProductProjection = {
  id: string;
  name: LocalizedString;
  description?: LocalizedString;
  categories: { id: string; obj?: { name: LocalizedString } }[];
  productType: { id: string; key?: string; obj?: { name: string } };
  masterVariant: CTVariant;
}; */

//!!!! to-do
export type HYTCTProductProjection = any;
