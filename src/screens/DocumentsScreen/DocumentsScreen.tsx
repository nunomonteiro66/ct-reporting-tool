import { usePaginationState } from "@commercetools-uikit/hooks";
import { useEffect, useState } from "react";
import { useProductsAPI } from "../../hooks/use-products-connector";
import { useGetProductTypes } from "../../hooks/use-products-connector/use-products-graphql";

const METADATA_TYPES = {
  "DOP/DOC metadata type": "dop",
  "EPD metadata type": "epd",
  "Data sheet metadata type": "datasheet",
};

const defaultColums = [
  { key: "key", label: "key" },
  {
    key: "sku",
    label: "SKU",
    isSortable: true,
  },
  { key: "name.en", label: "Product Name", isSortable: true },
  { key: "productType.obj.key", label: "Product Type Key" },
  { key: "productType.typeId", label: "Product Type Id" },
];

const extractAssets = (variant) => {
  return Object.keys(METADATA_TYPES).map((type) => {
    const defaultObj = {
      type: type,
      name: "",
      url: "",
    };

    const asset = variant.assets.filter(
      (asset) => asset?.custom?.fields?.nkt_metadata_type[0] === type
    );

    if (asset) {
      console.log("ASSET: ", asset);
    }

    if (asset) {
      defaultObj.name = asset.name.en;
      defaultObj.url = asset.sources[0].uri;
    }
    return defaultObj;
  });
};

const extractVariants = (allProducts) => {
  console.log("dasdasdas");
  console.log(allProducts[0]);
  const results = allProducts.map((product) => {
    return product.variants.map((variant) => {
      extractAssets(variant);
      /* variant.assets.map((asset) => {
        const type = asset?.custom?.fields?.nkt_metadata_type[0];
        const key = METADATA_TYPES[type];

        if (key) {
          return {
            key: asset.name.en,
            link: asset.sources[0].uri,
          };
        }
      }); */
    });
  });

  console.log("RESULT OF MAPPING: ", results);
};

const DocumentsScreen = () => {
  const { page, perPage } = usePaginationState();
  const { productTypes } = useGetProductTypes();
  const { fetchProducts, fetchAllProducts, fetchAllProductsParalel } =
    useProductsAPI();
  const [products, setProducts] = useState();
  const [mappedProducts, setMappedProducts] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [columns, setColumns] = useState(defaultColums);
  const [exportToCsv, setExportToCsv] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  //fetch the data from the api
  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        setLoading(true);
        //get all products
        const results = await fetchProducts({
          limit: perPage.value,
          page: page.value,
          expand: ["productType"],
        });

        setTotalItems(results?.total);
        setProducts(results?.results);
        extractVariants(results?.results);
      } catch (err) {
        //setError(err instanceof Error ? err : new Error("Unknown error"));
        console.error(err);
      } finally {
        //setLoading(false);
      }
    };
    loadAllProducts();
  }, [page.value, perPage.value]);

  return <p>xx </p>;
};

DocumentsScreen.displayName = "DocumentsScreen";

export default DocumentsScreen;
