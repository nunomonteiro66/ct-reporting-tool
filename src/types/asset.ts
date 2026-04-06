export type AssetType = 'doc' | 'dop' | 'datasheet' | 'image' | 'epd';

export type Asset = {
  url: string;
  name: string;
  type?: AssetType;
  language: string;
};
