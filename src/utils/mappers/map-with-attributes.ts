import { TAsset, TProduct, TProductVariant } from '../../types/generated/ctp';
import { MappedProduct } from '../../types/mapped-product';
import { ProductType } from '../../types/product-type';
import { getAsset, getAssetType } from '../get-asset-type';
import { getProductSelectionsNames } from './miscellaneous';

export type AttributeComplete = {
  value: string | string[];
  label: string | string[]; //in case we want the label to be in several lines
};

//extract all unique attributes, regardless of product type
export function extractUniqueAttributes(productTypes: ProductType[]) {
  //get a list of unique attributes (values only) (without the group)
  const uniqueAttributesValuesSet = new Set<string>();

  //get a list of unique attributes (without the group)
  const uniqueAttributesComplete: AttributeComplete[] = [];

  productTypes.forEach((group) => {
    group.attributes?.forEach((attr) => {
      if (!uniqueAttributesValuesSet.has(attr.value)) {
        uniqueAttributesValuesSet.add(attr.value);
        uniqueAttributesComplete.push(attr);
      }
    });
  });

  const uniqueAttributesValues = [...uniqueAttributesValuesSet];

  return { uniqueAttributesValues, uniqueAttributesComplete };
}

//for each variant, add all the available attributes, and set "N/A" to the attributes unavailable to the product type
function mapAllAttributes(
  uniqueAttributesComplete: AttributeComplete[],
  variant: TProductVariant,
  productType: ProductType
) {
  // Convert variant.attributes to a map for faster lookup
  const variantAttributesMap = Object.fromEntries(
    (variant.attributesRaw ?? []).map((attr) => [attr.name, attr])
  );

  // Convert productType.attributes to a Set for quick existence check
  const productTypeAttrSet = new Set(
    (productType?.attributes ?? []).map((attr) => attr.value ?? attr.label)
  );

  return uniqueAttributesComplete.reduce((acc, uniqueAttr) => {
    const key = uniqueAttr.value as string; //its always a string ("1,2,..."), only after mapping could be an array ([1,2,3,...])

    let value: string | string[] = '';

    const variantAttr = variantAttributesMap[key];

    if (variantAttr) {
      const val = variantAttr.value;
      const name = variantAttr.name;

      //attribute has several languages
      if (typeof val === 'object' && val !== null) {
        //special case
        if (variantAttr.name === '0000_branch_code') {
          value = Object.entries(val)
            .map(([lang, val]) => `${val} (${lang})`)
            .join(', ');
        } else {
          value = val;
        }
      } else {
        //check if it should be an array (several values)
        if (String(val).includes(',')) {
          value = String(val).split(',');
        } else value = val ?? '';
      }
    } else {
      // If attribute exists in product type, leave empty; else "N/A"
      value = productTypeAttrSet.has(key) ? '' : 'N/A';
    }
    acc[key] = value;
    return acc;
  }, {} as Record<string, AttributeComplete>);
}

//check if some of the metadata are present in the variant assets
const checkAssetType = (assets: TAsset[] = []) => {
  const result: Record<string, string> = {
    dop: 'No',
    doc: 'No',
    epd: 'No',
    datasheet: 'No',
  };

  assets.forEach((asset) => {
    const customFieldsRaw = asset.custom?.customFieldsRaw ?? [];
    const assetTypes = customFieldsRaw.map((field) =>
      Array.isArray(field.value) ? field.value[0] : field.value
    );

    customFieldsRaw.forEach((custom) => {
      const type = getAssetType(custom);
      if (type) result[type] = 'Yes';
    });
  });

  return result;
};

export function mapProducts(
  allProducts: TProduct[],
  productTypes: ProductType[]
): MappedProduct[] {
  //1º get all product types, and their respective attributes
  const { uniqueAttributesComplete } = extractUniqueAttributes(productTypes);

  //for each product in list
  return allProducts.flatMap((productRaw) => {
    const product = productRaw.masterData.current;
    const productProductType = productRaw.productType;

    if (!product) return [];

    //get all names from all locales
    const names = product.nameAllLocales.reduce(
      (acc, nameL) => ({
        ...acc,
        [nameL.locale]: nameL.value,
      }),
      {}
    );

    //get all descriptions for all locales
    const descriptions = product.nameAllLocales.reduce(
      (acc, descL) => ({
        ...acc,
        [descL.locale]: descL.value,
      }),
      {}
    );

    //get the product type (with all attributes) for the product type
    const productType = productTypes.find(
      (type) => type.product_type_value === (productProductType?.key ?? '')
    );

    //for each variant
    //each variant is a row, with the data from the parent (the product)
    return product.allVariants.map((variant) => {
      //check if variant has at least one image
      let hasImage: 'Yes' | 'No' = 'No';
      if (variant.images && variant.images.length > 0) hasImage = 'Yes';

      //check if any of the assets are present in the variant
      const assets = checkAssetType(variant.assets ?? []);

      //map from the all attributes
      let newAttributes = {};
      if (productType)
        newAttributes = mapAllAttributes(
          uniqueAttributesComplete,
          variant,
          productType
        );

      //add the product category name
      //!!! Note: for now each category has at most one parent, it can change in the future
      const categories = product.categories
        .map((category) =>
          category.parent
            ? `${category.parent.name} > ${category.name}`
            : category.name
        )
        .filter((c): c is string => Boolean(c));

      //add the product selections
      const selections = getProductSelectionsNames(
        productRaw.productSelectionRefs.results.map(
          (res) => res.productSelection?.name ?? ''
        )
      );

      return {
        ...productRaw,
        names: names,
        descriptions: descriptions,
        id: productRaw.id + Math.random(), //some keys get repeated (causes errors in the table)
        sku: variant.sku ?? '',
        attributes: newAttributes,
        image: hasImage,
        categories: categories,
        selections: selections,
        ...assets,
      };
    });
  });
}
