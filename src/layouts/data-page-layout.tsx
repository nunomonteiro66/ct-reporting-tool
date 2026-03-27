type DataPageLayoutProps = {
  title: string;
  totalResults?: number;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

const DataPageLayout = ({
  title,
  totalResults,
  actions,
  children,
}: DataPageLayoutProps) => {
  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">{title}</h1>
          {totalResults !== undefined && (
            <p className="text-sm text-gray-500">{totalResults} results</p>
          )}
        </div>
      </div>

      {/* Actions bar */}
      {actions && <div className="flex gap-2 ">{actions}</div>}

      {/* Body */}
      <div>{children}</div>
    </div>
  );
};

export default DataPageLayout;
