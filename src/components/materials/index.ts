import { lazy } from "react";

const Materials = lazy(() => import("./materials"));

export { default as FetchMaterials } from "./materials.graphql";
export default Materials;
