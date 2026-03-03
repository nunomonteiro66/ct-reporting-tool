import { useEffect, useRef, useState } from "react";
import { useProductsAPI } from "../../hooks/use-products-connector";
import ProductsTable from "../datatable/products-table";
import { mapCTProductResultToExport } from "../../utils/mapping";
import { usePaginationState } from "@commercetools-uikit/hooks";
import { TProduct } from "../../types/product";
import PrimaryButton from "@commercetools-uikit/primary-button";
import { CSVLink, CSVDownload } from "react-csv";

const ExportCSV = () => {
  const { fetchProductProjections, fetchProductsByMaterial, loading, error } =
    useProductsAPI();
  const data = useRef<TProduct[]>([]);
  const page = useRef(0);
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const loadAllProducts = async () => {
      let page = 0;
      const limit = 500;

      while (true) {
        const offset = page * limit;

        const result = await fetchProductProjections({
          offset,
          limit,
        });

        const mapped = mapCTProductResultToExport(result.results);
        data.current.push(...mapped);

        if (!isCancelled) {
          setTotal(result.total);
          setLoaded(data.current.length);
        }

        page++;

        if (data.current.length >= result.total) {
          break;
        }
      }
      setFinished(true);
    };

    loadAllProducts();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <>
      {finished ? (
        <>
          <CSVDownload data={data.current} target="_blank" /> FINISHED
        </>
      ) : (
        <span>
          {" "}
          Loaded: {loaded} from {total}
        </span>
      )}
    </>
  );
};

const Materials = () => {
  const { page, perPage } = usePaginationState();
  const {
    fetchProductProjections,
    fetchProductsByMaterial,
    fetchAllProducts,
    loading,
    error,
  } = useProductsAPI();

  const [products, setProducts] = useState<TProduct[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [filter, setFilter] = useState<string | undefined>();
  useEffect(() => {
    const loadProducts = async () => {
      try {
        /* const result = !filter
          ? await fetchProductProjections({
              offset,
              limit: perPage.value,
              //sort: `${tableSorting.value.key} ${tableSorting.value.order}`,
            })
          : await fetchProductsByMaterial({
              offset,
              limit: perPage.value,
              materialCode: filter,
            }); */

        const result = await fetchAllProducts({ limit: 20, offset: 0 });

        /* const result = await fetchProductsByMaterial({
          offset,
          limit: perPage.value,
          materialCode: "Cu",
        });
 */
        const mapped = mapCTProductResultToExport(result.results);
        setProducts(mapped || []);
        setTotalItems(result.total || 0);
      } catch (err) {
        //setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        //setLoading(false);
      }
    };

    loadProducts();
  }, [page.value, perPage.value, filter]);

  return (
    <>
      <div className="flex justify-between">
        <PrimaryButton
          label="Export CSV"
          onClick={() => setExporting(true)}
        ></PrimaryButton>
        <div className="flex gap-2">
          <PrimaryButton
            label="All"
            onClick={() => setFilter(undefined)}
          ></PrimaryButton>
          <PrimaryButton
            label="Cu"
            onClick={() => setFilter("Cu")}
          ></PrimaryButton>
          <PrimaryButton
            label="Al"
            onClick={() => setFilter("Al")}
          ></PrimaryButton>
        </div>
      </div>
      {exporting ? (
        <ExportCSV />
      ) : (
        <ProductsTable
          products={products}
          loading={loading}
          error={error}
          totalItems={totalItems}
          page={page}
          perPage={perPage}
        />
      )}
    </>
  );
};

Materials.displayName = "MaterialDetails";

export default Materials;
