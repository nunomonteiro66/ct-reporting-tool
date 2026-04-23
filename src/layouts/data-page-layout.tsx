import LoadingSpinner from '../components/loading-spinner/loading-spinner';
import { useTableContext } from '../screens/AllProducts/context';

type DataPageLayoutProps = {
  title: string;
  /* totalResults?: number;
  loading?: boolean; */
  actions?: React.ReactNode;
  children: React.ReactNode;
};

const DataPageLayout = ({
  title,
  /* totalResults,
  loading = false, */
  actions,
  children,
}: DataPageLayoutProps) => {
  const {
    state: { totalResults, loading },
  } = useTableContext();
  return (
    <>
      {loading ? (
        <LoadingSpinner scale="L" />
      ) : (
        <div className="flex flex-col gap-4 p-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">{title}</h1>
              {totalResults !== undefined && (
                <p className="text-sm text-gray-500">
                  <span id="total-results">{totalResults}</span> results
                </p>
              )}
            </div>
          </div>

          {/* Actions bar */}
          {actions && <div className="flex gap-2 ">{actions}</div>}

          {/* Body */}
          <div>{children}</div>
        </div>
      )}
    </>
  );
};

export default DataPageLayout;
