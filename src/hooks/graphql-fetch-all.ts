import {
  ApolloClient,
  ApolloQueryResult,
  DocumentNode,
  useQuery,
} from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import { TProductQueryResult } from '../types/generated/ctp';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';

type PaginatedResult<T> = {
  results: T[];
  total: number;
  count: number;
};

type ResultType<K extends string, T> = {
  //products: TProductQueryResult;
  [Key in K]: T;
};

export async function useGraphQLFetch<T, K extends string>(
  keyword: K,
  QUERY: DocumentNode,
  client: ApolloClient<object>,
  options?: {
    limit: number;
    page: number;
    context?: Record<string, any>;
    query?: Record<string, any>;
  }
) {
  /* const { data, loading, error } = useQuery<ResultType<K, PaginatedResult<T>>>(
    QUERY,
    {
      variables: {
        limit: options.limit,
        offset: (options.page - 1) * options.limit,
      },
      context: options?.context ?? {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      },
    }
  ); */

  const limit = options?.limit ?? 500;
  const page = options?.page ?? 0;

  const { data, loading, error } = await client.query({
    query: QUERY,
    variables: {
      limit: limit,
      offset: page * limit,
      ...(options?.query ?? {}),
    },
    context: options?.context ?? {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return { data: data ? data[keyword] : [], loading, error };
}

export async function graphqlFetchAll<T, K extends string>(
  keyword: K,
  QUERY: DocumentNode,
  client: any,
  options?: { limit?: number; context?: Record<string, any> }
): Promise<T[]> {
  const limit = options?.limit ?? 500;

  const fetchPage = (page: number) =>
    client.query({
      query: QUERY,
      variables: { limit, offset: page * limit },
      context: options?.context ?? {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      },
      fetchPolicy: 'no-cache', //allows to bypass the serialization of the requests
    });

  const firstResponse = await fetchPage(0);
  const first = firstResponse.data?.[keyword];

  if (!first) return [];

  const totalPages = Math.ceil(first.total / limit);

  const pages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) => fetchPage(i + 1))
  );

  const moreResults = pages.flatMap((p) => p.data?.[keyword]?.results ?? []);

  return [...first.results, ...moreResults];
}
