import { TProduct, TProductVariant } from '../../types/generated/ctp';
import { ProductType } from '../../types/product-type';

const METADATA_TYPES = {
  'DOP/DOC metadata type': 'dop',
  'EPD metadata type': 'epd',
  'Data sheet metadata type': 'datasheet',
};

export type AttributeComplete = {
  value: string;
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
  productType: ProductType,
  languages: string[]
) {
  // Convert variant.attributes to a map for faster lookup
  const variantAttributesMap = Object.fromEntries(
    (variant.attributesRaw ?? []).map((attr) => [attr.name, attr])
  );

  // Convert productType.attributes to a Set for quick existence check
  const productTypeAttrSet = new Set(
    (productType?.attributes ?? []).map((attr) => attr.value ?? attr.name)
  );

  return uniqueAttributesComplete.reduce((acc, uniqueAttr) => {
    const key = uniqueAttr.value;
    const label = uniqueAttr.label;

    let value: string | string[] = '';

    const variantAttr = variantAttributesMap[key];

    if (variantAttr) {
      const val = variantAttr.value;

      if (typeof val === 'object' && val !== null) {
        value = Object.entries(val)
          .filter(([lang]) => languages.includes(lang))
          .map(([lang, text]) => `${text} (${lang})`);
      } else {
        //check if it should be an array (several values)
        if (String(val).includes(',')) {
          value = val.split(',');
        } else value = val ?? '';
      }
    } else {
      // If attribute exists in product type, leave empty; else "N/A"
      value = productTypeAttrSet.has(key) ? '' : 'N/A';
    }

    acc[key] = { label, value };
    return acc;
  }, {});
}

//check if some of the metadata are present in the variant assets
const checkAssetType = (assets = []) => {
  const result = {
    dop: 'No',
    epd: 'No',
    datasheet: 'No',
  };

  assets.forEach((asset) => {
    const assetTypes = asset.custom.customFieldsRaw.map((field) =>
      Array.isArray(field.value) ? field.value[0] : field.value
    );

    assetTypes.forEach((type: string) => {
      const key: string = METADATA_TYPES[type];

      if (key) {
        result[key] = 'Yes';
      }
    });
  });

  return result;
};

export function mapProducts(
  allProducts: TProduct[],
  productTypes: ProductType[],
  languages: string[]
) {
  //1º get all product types, and their respective attributes
  const { uniqueAttributesValues, uniqueAttributesComplete } =
    extractUniqueAttributes(productTypes);

  //for each product in list
  return allProducts.flatMap((productRaw) => {
    const product = productRaw.masterData.current;
    const productProductType = productRaw.productType ?? [];

    if (!product) return;

    //get the product type (with all attributes) for the product type
    const productType = productTypes.find(
      (type) => type.product_type_value === productProductType.key
    );

    //for each variant
    //each variant is a row, with the data from the parent (the product)
    return product.allVariants.map((variant) => {
      //check if variant has at least one image
      let hasImage = 'No';
      if (variant.images && variant.images.length > 0) hasImage = 'Yes';

      //check if any of the assets are present in the variant
      const assets = checkAssetType(variant.assets ?? []);

      //map from the all attributes
      let newAttributes = {};
      if (productType)
        newAttributes = mapAllAttributes(
          uniqueAttributesComplete,
          variant,
          productType,
          languages
        );

      //add the product category name
      //!!! Note: for now each category has at most one parent, it can change in the future
      const categories = product.categories.map((category) =>
        category.parent
          ? `${category.parent.name} > ${category.name}`
          : category.name
      );

      //add the variant product selections
      const selections = productRaw.productSelectionRefs.results
        .filter((selectionRef) => {
          const skus = selectionRef.variantSelection?.skus;
          return !skus || skus.includes(variant.sku ?? '');
        })
        .map(
          (selection) => selection.productSelection?.name?.split(' ')[0] ?? ''
        );

      return {
        ...productRaw,
        id: productRaw.id + Math.random(), //some keys get repeated (causes errors in the table)
        sku: variant.sku,
        attributes: newAttributes,
        image: hasImage,
        categories: categories,
        selections: selections,
        ...assets,
      };
    });
  });
}
