//gets all categories names and ids

import { QueryResult, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import CATEGORIES_NAMES_QUERY from "./graphql-queries/categories-names.graphql";
import { GRAPHQL_TARGETS } from "@commercetools-frontend/constants";
import { TCategory, TCategoryQueryResult } from "../../types/generated/ctp";
import { CategoryNames } from "../../types/category";

type ResultType = {
  categories: TCategoryQueryResult;
};

//used to cross-reference with the products, since the api only returns the id of the category
export const useGetAllCategoriesNames = () => {
  const limit = 500;
  const [allCategories, setAllCategories] = useState<TCategory[]>([]);

  const { data, loading, error, fetchMore } = useQuery<ResultType>(
    CATEGORIES_NAMES_QUERY,
    {
      variables: { limit, offset: 0 },
      context: { target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM },
    }
  );

  useEffect(() => {
    if (!data || !data.categories) return;

    //the actual results data
    const rData = data.categories;

    // Initialize with the first page
    setAllCategories((prev) => [...prev, ...rData.results]);

    const total = rData.total;
    let loaded = rData.count + limit;

    const loadMore = async () => {
      while (loaded < total) {
        const { data: moreData } = await fetchMore({
          variables: { limit, loaded },
        });

        if (!moreData || !moreData.categories) break;
        setAllCategories((prev) => [...prev, ...moreData.categories.results]);

        loaded += moreData.categories.count;
      }
    };

    loadMore();
  }, [data, fetchMore]);

  return { allCategories, loading, error } as {
    allCategories: CategoryNames[];
  };
};
