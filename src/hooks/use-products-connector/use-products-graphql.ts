import { useApolloClient, useQuery } from '@apollo/client/react';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import PRODUCT_TYPES_QUERY from './graphql-queries/product-types.graphql';
import PRODUCTS_QUERY from './graphql-queries/products.graphql';
import PRODUCTS_DOCUMENTS from './graphql-queries/product-documents.graphql';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMcQuery } from '@commercetools-frontend/application-shell';
import { DocumentNode } from 'graphql';
import { graphqlFetchAll, useGraphQLFetch } from '../graphql-fetch-all';
import { TProduct, TProductQueryResult } from '../../types/generated/ctp';
import { ApolloClient } from '@apollo/client';

export const useProductsGraphql = () => {
  const client = useApolloClient();

  const getAllProducts = useCallback(() => {
    return graphqlFetchAll<TProduct, 'products'>(
      'products',
      PRODUCTS_QUERY,
      client,
      { limit: 50 }
    );
  }, [client]);

  //fetches all possible product types, and the returns the unique ones
  const getAllProductTypes = useCallback(async () => {
    const data = await graphqlFetchAll<any, 'productTypes'>(
      'productTypes',
      PRODUCT_TYPES_QUERY,
      client
    );

    const finalData = data.map((product_type) => {
      const allAttributes = product_type.attributeDefinitions.results.map(
        (attr: any) => ({
          value: attr.name,
          label: attr.inputTip
            ? `${attr.label} [${attr.inputTip}]`
            : `${attr.label}`,
        })
      );

      return {
        product_type_name: product_type.name,
        product_type_value: product_type.key,
        attributes: allAttributes,
      };
    });
    return finalData;
  }, [client]);

  const getProducts = useCallback(
    async (page: number, limit: number) => {
      const { data, loading, error } = await useGraphQLFetch<
        TProduct,
        'products'
      >('products', PRODUCTS_QUERY, client, {
        limit: limit,
        page: page,
      });

      return { data, loading, error };
    },
    [client]
  );

  const getAllProductsDocuments = useCallback(() => {
    return graphqlFetchAll<TProduct, 'products'>(
      'products',
      PRODUCTS_DOCUMENTS,
      client
    );
  }, [client]);

  return {
    getAllProducts,
    getAllProductTypes,
    getProducts,
    getAllProductsDocuments,
  };
};

// get all product types, and their attributes
export const useGetProductTypes = () => {
  const { allData: allProductTypes, loading } = useGetAllProductTypes();

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

  return { allData: productTypes, loading };
};
