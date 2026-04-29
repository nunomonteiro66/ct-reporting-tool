import { createContext, useContext, useRef, useState } from 'react';
import { Column } from '../../types/datatable-column';
import { TAppliedFilter } from '@commercetools-uikit/filters';
import { FiltersProps } from '../../components/filters/filters';
import { PaginationState, Table } from '@tanstack/react-table';
import {
  TableActions,
  TableContextType,
  TableState,
} from '../../types/table-context';

export function createTableContext<T>() {
  const TableContext = createContext<TableContextType<T> | null>(null);

  function TableProvider({
    children,
    initialState,
  }: {
    children: React.ReactNode;
    initialState?: Partial<TableState<T>>;
  }) {
    const [totalResults, setTotalResults] = useState(
      initialState?.totalResults ?? 0
    );
    const [columns, setColumns] = useState<Column[]>(
      initialState?.columns ?? []
    );
    const [loading, setLoading] = useState(initialState?.loading ?? false);
    const [columnOrder, setColumnOrder] = useState<string[]>(
      initialState?.columnOrder ?? []
    );
    const [visibleColumns, setVisibleColumns] = useState<string[]>(
      initialState?.visibleColumns ?? []
    );
    const [appliedFilters, setAppliedFilters] = useState<
      Record<string, string[]>
    >(initialState?.appliedFilters ?? {});

    const [filtersConfig, setFiltersConfig] = useState<FiltersProps[]>(
      initialState?.filtersConfig ?? []
    );
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
      initialState?.selectedLanguages ?? ['en']
    );
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 20,
    });
    const [table, setTable] = useState<Table<T> | null>(
      initialState?.table ?? null
    );

    const state: TableState<T> = {
      totalResults,
      columns,
      loading,
      columnOrder,
      visibleColumns,
      appliedFilters,
      filtersConfig,
      selectedLanguages,
      pagination,
      table,
    };

    const actions: TableActions<T> = {
      setTotalResults,
      setColumns,
      setLoading,
      setColumnOrder,
      setVisibleColumns,
      setAppliedFilters,
      setFiltersConfig,
      setSelectedLanguages,
      setPagination,
      setTable,
    };

    return (
      <TableContext.Provider value={{ state, actions }}>
        {children}
      </TableContext.Provider>
    );
  }

  function useTableContext() {
    const context = useContext(TableContext);
    if (!context)
      throw new Error('useTableContext must be used inside TableProvider');
    return context;
  }

  return { TableProvider, useTableContext };
}
