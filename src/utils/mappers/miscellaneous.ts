//given the full product selection name, return only the part we want

import { TSelectionOfProduct } from '../../types/generated/ctp';

//f.e Global product selection => Global
export const getProductSelectionsNames = (productSelections: string[]) =>
  productSelections.map((name) => name.split(' ')[0] ?? '');

export const getProductSelections = (
  results: TSelectionOfProduct[],
  variantSku: string
) =>
  getProductSelectionsNames(
    results
      .filter((res) => {
        const selectionVariantSkus = res.variantSelection?.skus;
        if (!selectionVariantSkus) return true;
        return selectionVariantSkus.some((sku) => sku === variantSku);
      })
      .map((res) => res.productSelection?.name ?? '')
  );
