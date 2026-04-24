import { AttributeComplete } from '../../types/attribute';
import { TAsset, TProduct, TProductVariant } from '../../types/generated/ctp';
import { MappedProduct } from '../../types/mapped-product';
import { ProductType } from '../../types/product-type';
import { getAssetType } from '../get-asset-type';
import { getProductSelections } from './miscellaneous';

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
      } else {
        //some product types have more translations
        const current = uniqueAttributesComplete.find(
          (attribute) => attribute.value === attr.value
        );
        if (current)
          attr.label_locales.forEach((newLocale) => {
            //only add locales that don't exist
            if (
              !current.label_locales.some(
                (locale) => locale.locale === newLocale.locale
              ) &&
              newLocale.value != ''
            ) {
              current.label_locales.push(newLocale);
            }
          });
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
    (productType?.attributes ?? []).map((attr) => attr.value ?? attr.label)
  );

  return uniqueAttributesComplete.reduce((acc, uniqueAttr) => {
    const key = uniqueAttr.value as string; //its always a string ("1,2,..."), only after mapping could be an array ([1,2,3,...])

    let value: string | Record<string, unknown> | string[] = '';

    const variantAttr = variantAttributesMap[key];

    //variant has value for this attribute
    if (variantAttr) {
      const val = variantAttr.value;

      //localization
      if (typeof val === 'object' && val !== null) {
        value =
          variantAttr.name === '0000_branch_code'
            ? Object.entries(val)
                .map(([lang, v]) => `${v} (${lang})`)
                .join(', ')
            : val;
      } else {
        value = val;
      }
    } else {
      const isBranchCode =
        uniqueAttr.type === 'ltext' && uniqueAttr.value !== '0000_branch_code';
      const isEmpty = productTypeAttrSet.has(key);

      value = isEmpty
        ? ''
        : isBranchCode
        ? languages.reduce<Record<string, string>>(
            (acc, lang) => ({ ...acc, [lang]: 'N/A' }),
            {}
          )
        : 'N/A';
    }
    acc[key] = value;
    return acc;
  }, {} as Record<string, string | Record<string, unknown>>);
}

type AssetFields = Pick<MappedProduct, 'dop' | 'epd' | 'datasheet'>;

//check if some of the metadata are present in the variant assets
const checkAssetType = (assets: TAsset[] = []): AssetFields => {
  const result = {
    dop: 'No',
    doc: 'No',
    epd: 'No',
    datasheet: 'No',
  } as AssetFields;

  assets.forEach((asset) => {
    const customFieldsRaw = asset.custom?.customFieldsRaw ?? [];
    customFieldsRaw.forEach((custom) => {
      const type = getAssetType(custom);
      if (type && type in result) result[type as keyof AssetFields] = 'Yes';
    });
  });

  return result;
};

export function mapProducts(
  allProducts: TProduct[],
  productTypes: ProductType[],
  languages: string[]
): MappedProduct[] {
  //1º get all product types, and their respective attributes
  const { uniqueAttributesComplete } = extractUniqueAttributes(productTypes);

  //for each product in list
  return allProducts.flatMap((productRaw) => {
    const product = productRaw.masterData.current;
    const productProductType = productRaw.productType;

    if (!product) return [];

    //get all names from all locales
    const names = product.nameAllLocales.reduce<Record<string, string>>(
      (acc, nameL) => ({
        ...acc,
        [nameL.locale]: nameL.value,
      }),
      {}
    );

    //get all descriptions for all locales
    const descriptions =
      product.descriptionAllLocales?.reduce<Record<string, string>>(
        (acc, descL) => ({
          ...acc,
          [descL.locale]: descL.value,
        }),
        {}
      ) ?? {};

    //get the product type (with all attributes) for the product type
    const productType = productTypes.find(
      (type) => type.product_type_value === (productProductType?.key ?? '')
    );

    //for each variant
    //each variant is a row
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
          productType,
          languages
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
      const selections = getProductSelections(
        productRaw.productSelectionRefs.results,
        variant.sku ?? ''
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

export async function mapProductsParallel(
  allProducts: TProduct[],
  productTypes: ProductType[],
  languages: string[],
  chunkSize: number = 200
): Promise<MappedProduct[]> {
  const { uniqueAttributesComplete } = extractUniqueAttributes(productTypes);
  const chunks = chunkArray(allProducts, chunkSize);
  const results: MappedProduct[][] = [];

  for (const chunk of chunks) {
    // Yield to the browser between chunks to keep UI responsive
    await new Promise((resolve) => setTimeout(resolve, 0));

    const mapped = chunk.flatMap((productRaw) => {
      const product = productRaw.masterData.current;
      const productProductType = productRaw.productType;
      if (!product) return [];

      const names = product.nameAllLocales.reduce<Record<string, string>>(
        (acc, nameL) => ({ ...acc, [nameL.locale]: nameL.value }),
        {}
      );

      const descriptions =
        product.descriptionAllLocales?.reduce<Record<string, string>>(
          (acc, descL) => ({ ...acc, [descL.locale]: descL.value }),
          {}
        ) ?? {};

      const productType = productTypes.find(
        (type) => type.product_type_value === (productProductType?.key ?? '')
      );

      return product.allVariants.map((variant) => {
        let hasImage: 'Yes' | 'No' = 'No';
        if (variant.images && variant.images.length > 0) hasImage = 'Yes';

        const assets = checkAssetType(variant.assets ?? []);

        let newAttributes = {};
        if (productType)
          newAttributes = mapAllAttributes(
            uniqueAttributesComplete,
            variant,
            productType,
            languages
          );

        const categories = product.categories
          .map((category) =>
            category.parent
              ? `${category.parent.name} > ${category.name}`
              : category.name
          )
          .filter((c): c is string => Boolean(c));

        const selections = getProductSelections(
          productRaw.productSelectionRefs.results,
          variant.sku ?? ''
        );

        return {
          ...productRaw,
          names,
          descriptions,
          id: productRaw.id + Math.random(),
          sku: variant.sku ?? '',
          attributes: newAttributes,
          image: hasImage,
          categories,
          selections,
          ...assets,
        };
      });
    });

    results.push(mapped);
  }

  return results.flat();
}

// helper
function chunkArray<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}
