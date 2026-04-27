import { mapProducts, mapProductsParallel } from '../map-with-attributes';
import { rawData } from '../../../../test-data/raw-data';
import { productTypes } from '../../../../test-data/product-types';
import { languages } from '../../../../test-data/languages';
import { expected } from '../../../../test-data/mapped';

const removeId = (data) => data.map((d) => ({ ...d, id: '' }));

describe('Products mapping with attributes', () => {
  it('maps raw products correctly', () => {
    const result = mapProducts(rawData, productTypes, languages);

    expect(removeId(result)).toEqual(removeId(expected));
  });

  it('maps raw products correctly (parallel)', async () => {
    const newProducts = await mapProductsParallel(
      rawData,
      productTypes,
      languages
    );

    expect(removeId(newProducts)).toEqual(removeId(expected));
  });
});
