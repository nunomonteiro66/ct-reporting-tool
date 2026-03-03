import { useApplicationContext } from "@commercetools-frontend/application-shell-connectors";
import { useAsyncDispatch } from "@commercetools-frontend/sdk";
import { useCallback, useState } from "react";
import QueryParams from "../types/api-query";

export default function requestHandler() {
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
      queryParams?: QueryParams;
    }): Promise<T> => {
      setLoading(true);
      setError(null);

      //query params with defaults
      const newQueryParams = (queryParams: QueryParams) => ({
        offset: (queryParams.page ?? 0) * (queryParams.limit ?? 500),
        limit: queryParams.limit ?? 500,
        where: queryParams.where,
        sort: queryParams.sort,
        expand: queryParams.expand,
      });

      try {
        const params = new URLSearchParams();

        if (queryParams) {
          Object.entries(newQueryParams(queryParams)).forEach(
            ([key, value]) => {
              if (value === undefined || value === null) return;

              if (Array.isArray(value)) {
                value.forEach((v) => params.append(key, v));
              } else {
                params.append(key, String(value));
              }
            }
          );
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
  return {
    executeRequest,
    loading,
    error,
  };
}
