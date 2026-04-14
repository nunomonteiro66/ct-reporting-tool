//gets all categories names and ids

import { useApolloClient } from '@apollo/client';
import { useCallback } from 'react';
import { TCategory } from '../../types/generated/ctp';
import { graphqlFetchAll } from '../graphql-fetch-all';
import CATEGORIES_QUERY from './graphql-queries/categories.graphql';

export const useCategoriesGraphql = () => {
  const client = useApolloClient();

  const getAllCategories = useCallback(() => {
    return graphqlFetchAll<TCategory, 'categories'>(
      'categories',
      CATEGORIES_QUERY,
      client
    );
  }, [client]);

  return {
    getAllCategories,
  };
};
