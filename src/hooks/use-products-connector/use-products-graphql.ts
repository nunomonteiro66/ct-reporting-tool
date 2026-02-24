import { useQuery } from "@apollo/client/react";
import { GRAPHQL_TARGETS } from "@commercetools-frontend/constants";
import PRODUCT_TYPES_QUERY from "./graphql-queries/product-types.graphql";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMcQuery } from "@commercetools-frontend/application-shell";
import { DocumentNode } from "graphql";

//fetches all possible product types, and the returns the unique ones
export const useGetAllProductTypes = () => {
  const limit = 500;
  const [allProductTypes, setAllProductTypes] = useState<any[]>([]);

  const { data, loading, error, fetchMore } = useQuery(PRODUCT_TYPES_QUERY, {
    variables: { limit, offset: 0 },
    context: { target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM },
  });

  //!!!! we assume that each productTypeGroup has bellow 500 types
  useEffect(() => {
    if (!data) return;

    // Inicializa com a primeira página
    setAllProductTypes(data.productTypes.results);

    const total = data.productTypes.total;
    let loaded = data.productTypes.results.length;

    const loadMore = async () => {
      let offset = loaded;

      while (loaded < total) {
        const { data: moreData } = await fetchMore({
          variables: { limit, offset },
        });

        setAllProductTypes((prev) => [
          ...prev,
          ...moreData.productTypes.results,
        ]);

        loaded += moreData.productTypes.results.length;
        offset = loaded;
      }
    };

    loadMore();
  }, [data, fetchMore]);

  return { allProductTypes, loading, error };
};

// get all product types, and their attributes
export const useGetProductTypes = () => {
  const { allProductTypes, loading } = useGetAllProductTypes();

  const productTypes = useMemo(() => {
    if (!allProductTypes || allProductTypes.length === 0) return [];

    const finalData = allProductTypes
      //.flatMap((product) => product.attributeDefinitions?.results || [])
      .map((product_type) => {
        const allAttributes = product_type.attributeDefinitions.results.map(
          (attr: any) => ({
            value: attr.name,
            label: attr.label,
          })
        );

        return {
          product_type_name: product_type.name,
          product_type_value: product_type.key,
          attributes: allAttributes,
        };
      });
    return finalData;
  }, [allProductTypes]);

  return { productTypes, loading };
};
