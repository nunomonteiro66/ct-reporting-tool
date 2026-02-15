import { useCallback, useState } from "react";
import { useApplicationContext } from "@commercetools-frontend/application-shell-connectors";
import {
  TProduct,
  TProductProjection,
  TProductProjectionSearchResult,
} from "../../types/generated/ctp";
import { useAsyncDispatch, actions } from "@commercetools-frontend/sdk";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const dispatch = useAsyncDispatch();

  const { projectKey } = useApplicationContext((context) => ({
    projectKey: context.project?.key,
  }));

  const executeRequest = useCallback(
    async <T>({
      uri,
      queryParams,
    }: {
      uri: string;
      queryParams?: Record<string, any>;
    }): Promise<T> => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (queryParams) {
          Object.entries(queryParams).forEach(([key, value]) => {
            if (value === undefined || value === null) return;

            if (Array.isArray(value)) {
              value.forEach((v) => params.append(key, v));
            } else {
              params.append(key, String(value));
            }
          });
        }

        const result = await dispatch({
          type: "SDK",
          payload: {
            method: "GET",
            uri: `/${projectKey}/${uri}?${params.toString()}`,
          },
        });

        return result as T;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [dispatch, projectKey]
  );

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

  const fetchProductProjections = useCallback(
    (queryParams: {
      offset?: number;
      limit?: number;
      where?: string;
      sort?: string;
      expand?: string[];
    }) =>
      executeRequest<TProductProjection>({
        uri: "product-projections",
        queryParams: {
          offset: queryParams.offset ?? 0,
          limit: queryParams.limit ?? 500,
          where: queryParams.where,
          sort: queryParams.sort,
          expand: queryParams.expand,
        },
      }),
    [executeRequest]
  );

  const fetchAllProducts = useCallback(
    (queryParams: {
      offset?: number;
      limit?: number;
      where?: string;
      sort?: string;
      expand?: string[];
    }) =>
      executeRequest<TProductProjectionSearchResult>({
        uri: "product-projections",
        queryParams: {
          offset: queryParams.offset ?? 0,
          limit: queryParams.limit ?? 500,
          where: queryParams.where,
          sort: queryParams.sort,
          expand: queryParams.expand,
          localeProjection: "en",
        },
      }),
    [executeRequest]
  );

  return {
    fetchProductsByMaterial,
    fetchProductProjections,
    fetchAllProducts,
    loading,
    error,
  };
};
