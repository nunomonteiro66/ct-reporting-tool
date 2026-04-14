import { Asset, AssetType } from '../types/asset';
import { TAsset, TRawCustomField } from '../types/generated/ctp';

const ASSET_TYPES = new Set<AssetType>([
  'doc',
  'dop',
  'datasheet',
  'image',
  'epd',
]);

export const getAssetType = (
  attributesRaw: TRawCustomField
): AssetType | undefined => {
  const valueString = String(attributesRaw.value[0]);
  let assetType: string | undefined;

  switch (attributesRaw.name) {
    case 'nkt_dOPDOCNumber':
      assetType = valueString.slice(0, 3).toLowerCase();
      break;
    case 'nkt_metadata_type':
      switch (valueString) {
        case 'EPD metadata type':
          assetType = 'epd';
          break;
        case 'Data sheet metadata type':
          assetType = 'datasheet';
          break;
      }
  }

  return ASSET_TYPES.has(assetType as AssetType)
    ? (assetType as AssetType)
    : undefined;
};

export const getAsset = (asset: TAsset): Asset | undefined => {
  const assetType = asset.custom?.customFieldsRaw
    ?.map((custom) => getAssetType(custom))
    .find((c): c is AssetType => c !== undefined);

  if (!assetType) return;
  const name = asset.name;
  const url = asset.sources[0].uri;

  //some files are bilingual
  const languages = asset.tags;

  return {
    name: name ?? '',
    url: url,
    languages: languages,
    type: assetType!,
  };
};
