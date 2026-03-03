import { useEffect, useState } from "react";
import {
  TProductSelection,
  TProductSelectionQueryResult,
} from "../../types/generated/ctp";
import { useQuery } from "@apollo/client";
import PRODUCT_SELECTIONS_QUERY from "./graphql-queries/product-selections.graphql";
import VARIANTS_PRODUCT_SELECTIONS_QUERY from "./graphql-queries/product-selections-variants.graphql";
import { GRAPHQL_TARGETS } from "@commercetools-frontend/constants";
import { useGraphQLFetch, useGraphQLFetchAll } from "../graphql-fetch-all";
import { ProductSelection } from "../../types/product-selection";

type ResultType = {
  productSelections: TProductSelectionQueryResult;
};

//gets all product selections names and ids
export const useGetAllProductSelections = () =>
  useGraphQLFetchAll<TProductSelection, "productSelections">(
    "productSelections",
    PRODUCT_SELECTIONS_QUERY
  );
