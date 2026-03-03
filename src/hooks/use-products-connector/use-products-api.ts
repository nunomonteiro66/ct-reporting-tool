import { useCallback, useState } from "react";
import { useApplicationContext } from "@commercetools-frontend/application-shell-connectors";
import {
  TProduct,
  TProductProjection,
  TProductProjectionSearchResult,
} from "../../types/generated/ctp";
import { useAsyncDispatch, actions } from "@commercetools-frontend/sdk";
import requestHandler from "../request-handler";
import QueryParams from "../../types/api-query";

/* type TProductProjection = {
  id: string;
  key?: string;
  masterVariant: {
    id: number;
    sku?: string;
    attributes: Array<{
      name: string;
      value: any;
    }>;
  };
  variants: Array<{
    id: number;
    sku?: string;
    attributes: Array<{
      name: string;
      value: any;
    }>;
  }>;
};

type TProductProjectionsResponse = {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: TProductProjection[];
}; */

export const useProductsAPI = () => {
  const { executeRequest, loading, error } = requestHandler();

  const fetchProductsByMaterial = useCallback(
    (materialCode: string, options?: { offset?: number; limit?: number }) => {
      const whereClause = `
      masterVariant(attributes(name="14_material_of_conductor" and value(en="${materialCode}")))
      or
      variants(attributes(name="14_material_of_conductor" and value(en="${materialCode}")))
    `;

      return executeRequest<TProductProjectionSearchResult>({
        uri: "product-projections",
        queryParams: {
          offset: options?.offset ?? 0,
          limit: options?.limit ?? 500,
          where: whereClause,
        },
      });
    },
    [executeRequest]
  );

  const fetchProducts = useCallback(
    (queryParams: QueryParams) =>
      executeRequest<TProductProjectionSearchResult>({
        uri: "product-projections",
        queryParams: queryParams,
      }),
    [executeRequest]
  );

  //tries to fetch all products available
  const fetchAllProducts = async ({ expand }: { expand: string[] }) => {
    const totalData = [];
    for (let page = 0; ; page++) {
      const results = await fetchProducts({
        page: page,
        limit: 1,
        expand: expand,
      });

      totalData.push(...results.results);
      if (totalData.length === results.total) break;

      if (totalData.length > results.total) {
        throw new Error(
          `Data shouldn't be bigger than the total. ${totalData}`
        );
      }
    }
    return totalData;
  };

  const fetchAllProductsParalel = async ({ expand }: { expand: string[] }) => {
    const limit = 500;

    const first = await fetchProducts({ page: 0, limit, expand });
    const totalPages = Math.ceil(first.total / limit);

    const pages = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) =>
        fetchProducts({ page: i + 1, limit, expand })
      )
    );

    return [...first.results, ...pages.flatMap((p) => p.results)];
  };

  return {
    fetchProductsByMaterial,
    fetchProducts,
    fetchAllProducts,
    fetchAllProductsParalel,
    loading,
    error,
  };
};
