import { useApolloClient } from '@apollo/client/react';
import PRODUCT_TYPES_QUERY from './graphql-queries/product-types.graphql';
import PRODUCTS_QUERY from './graphql-queries/products.graphql';
import PRODUCTS_DOCUMENTS from './graphql-queries/product-documents.graphql';
import PRODUCTS_IMAGES from './graphql-queries/product-images.graphql';
import { useCallback } from 'react';
import { graphqlFetchAll, useGraphQLFetch } from '../graphql-fetch-all';
import { TProduct } from '../../types/generated/ctp';

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
          type: attr.type.name,
          label_locales: attr.labelAllLocales,
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

  const getProductDocuments = useCallback(
    async (page: number, limit: number) => {
      const { data, loading, error } = await useGraphQLFetch<
        TProduct,
        'products'
      >('products', PRODUCTS_DOCUMENTS, client, {
        limit: limit,
        page: page,
      });

      return { data, loading, error };
    },
    [client]
  );

  const getAllProductsImages = useCallback(() => {
    return graphqlFetchAll<TProduct, 'products'>(
      'products',
      PRODUCTS_IMAGES,
      client,
      { limit: 50 }
    );
  }, [client]);

  return {
    getAllProducts,
    getAllProductTypes,
    getProducts,
    getAllProductsDocuments,
    getProductDocuments,
    getAllProductsImages,
  };
};
