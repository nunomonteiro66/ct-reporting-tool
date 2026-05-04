import { mapProducts, mapProductsParallel } from '../map-with-attributes';
import { rawData } from '../../../../test-data/raw-data';
import { productTypes } from '../../../../test-data/product-types';
import { languages } from '../../../../test-data/languages';
import { expected } from '../../../../test-data/mapped';
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';

const removeId = (data) => data.map((d) => ({ ...d, id: '' }));

describe('Products mapping with attributes', () => {
  it('maps raw products correctly', () => {
    const result = mapProducts(rawData, productTypes, languages);

    writeFileSync(
      join(__dirname, 'output-sync.json'),
      JSON.stringify(removeId(result), null, 2)
    );

    expect(removeId(result)).toEqual(removeId(expected));
  });

  it('maps raw products correctly (parallel)', async () => {
    const newProducts = await mapProductsParallel(
      rawData,
      productTypes,
      languages
    );

    writeFileSync(
      join(__dirname, 'output-parallel.json'),
      JSON.stringify(removeId(newProducts), null, 2)
    );

    expect(removeId(newProducts)).toEqual(removeId(expected));
  });
});
