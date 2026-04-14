import { ColumnFilter, ColumnFiltersState } from '@tanstack/react-table';
import { Dispatch, SetStateAction } from 'react';
import { Tag } from '@commercetools-uikit/tag';
import { Column } from '../../types/datatable-column';

type ColumnFiltersTagsProps = {
  columns: Partial<Column>[];
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
};

const ColumnFiltersTags = ({
  columns,
  columnFilters,
  setColumnFilters,
}: ColumnFiltersTagsProps) => {
  const getLabel = (id: string) =>
    columns.find((col) => col.key === id)?.label ?? '';

  const removeFilter = (columnFilter: ColumnFilter, value: string) => {
    setColumnFilters((prev) =>
      prev
        .map((filter) =>
          filter.id === columnFilter.id
            ? {
                ...filter,
                value: (filter.value as string[]).filter(
                  (val) => val !== value
                ),
              }
            : filter
        )
        .filter((filter) => (filter.value as string[]).length > 0)
    );
  };

  return (
    <div className="grid grid-cols-[repeat(5,auto)] gap-2">
      {columnFilters.map((columnFilter) =>
        (columnFilter.value as string[]).map((value) => (
          <Tag
            onRemove={() => removeFilter(columnFilter, value)}
            tone="primary"
            horizontalConstraint="auto"
          >
            {`${getLabel(columnFilter.id)}: ${value}`}
          </Tag>
        ))
      )}
    </div>
  );
};

export default ColumnFiltersTags;
