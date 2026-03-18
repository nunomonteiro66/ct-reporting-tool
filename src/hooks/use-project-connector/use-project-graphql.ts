import { useApolloClient, useQuery } from '@apollo/client';
import { TCategoryQueryResult } from '../../types/generated/ctp';
import LANGUAGES_CODES_QUERY from './graphql-queries/languages-codes.graphql';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { graphqlFetchAll, useGraphQLFetch } from '../graphql-fetch-all';
import { useCallback } from 'react';

type ResultType = {
  __typename: string;
  languages: string[];
};

export const useProjectGraphql = () => {
  const client = useApolloClient();

  const getAllLanguagesCodes = useCallback(async () => {
    const { data } = await useGraphQLFetch<ResultType, 'project'>(
      'project',
      LANGUAGES_CODES_QUERY,
      client
    );
    return data.languages;
  }, [client]);

  return {
    getAllLanguagesCodes,
  };
};
