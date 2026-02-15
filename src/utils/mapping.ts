import { CTProductProjection } from "../types/ct-product";
import { TProduct } from "../types/product";

export const mapCTProductToExport = (
  product: CTProductProjection,
  locale: string = "en"
): TProduct => {
  const attrs = product.masterVariant?.attributes || [];

  const getAttr = (name: string) => attrs.find((a) => a.name === name)?.value;

  const getAttrLocalized = (name: string) => {
    const val = getAttr(name);
    if (!val) return "";
    if (typeof val === "object") return val[locale] || val.en || "";
    return String(val);
  };

  return {
    id: product.id,
    sku: product.masterVariant?.sku || "",
    product_name: product.name?.[locale] || product.name?.en || "",
    product_description:
      product.description?.[locale] || product.description?.en || "",
    product_category:
      product.categories?.[0]?.obj?.name?.[locale] ||
      product.categories?.[0]?.obj?.name?.en ||
      product.categories?.[0]?.id ||
      "",
    product_type_key: product.productType?.key || product.productType?.id || "",
    product_type_name: product.productType?.obj?.name || "",
    type: getAttr("7_type") || "",
    material: getAttrLocalized("14_material_of_conductor"),
    colour: getAttrLocalized("842_colour_of_sheath"),
    cross_section: String(getAttr("92_cross_section") || ""),
    length_type: getAttrLocalized(
      "1867_sap_characteristic_znkt_millca_standard_length"
    ),
    specification: getAttr("96_norm_standard") || "",
    minimal_temperature: String(
      getAttr("853_operating_cond_temperature_max") || ""
    ),
    ean: getAttr("0000_barcode_ean_code") || "",
    el: "", // ❌ not present
    length: String(getAttr("0000_length") || ""),
    packaging: getAttrLocalized("0000_drum_type"),
    application: "", // ❌ not present
    country_specific: getAttr("0000_country_specific") || "",
    customer_specific: "", // ❌ not present
    plants: getAttr("0000_plants") || "",
    sales_organizations: getAttr("0000_sales_orgs") || "",
    product_selection: "", // ❌ not present
    image: product.masterVariant?.images?.[0]?.url || "",
    datasheet: "", // ❌ not present
    dop_doc: "", // ❌ not present
    epd: "", // ❌ not present
    variants: product.variants,
  };
};

export const mapCTProductResultToExport = (
  products: CTProductProjection[],
  locale: string = "en"
) => {
  return products.map((product) => mapCTProductToExport(product, locale));
};
