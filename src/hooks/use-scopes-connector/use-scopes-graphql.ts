import { useQuery } from "@apollo/client";
import SCOPES_LIST_QUERY from "./graphql-queries/scopes-list.graphql";
import { GRAPHQL_TARGETS } from "@commercetools-frontend/constants";

export const useGetScopesList = () => {
  const { data, loading, error, fetchMore } = useQuery<any>(SCOPES_LIST_QUERY, {
    context: { target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM },
  });

  return { allScopesList: data, loading, error };
};
