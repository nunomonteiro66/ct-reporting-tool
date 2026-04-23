import { createContext, useContext, useRef, useState } from 'react';
import { Column } from '../../types/datatable-column';
import { TAppliedFilter } from '@commercetools-uikit/filters';
import { FiltersProps } from '../../components/filters/filters';
import { Table } from '@tanstack/react-table';

interface TableState<T> {
  totalResults: number;
  columns: Column[];
  loading: boolean;
  columnOrder: string[];
  visibleColumns: string[];
  appliedFilters: TAppliedFilter[];
  filtersConfig: FiltersProps[];
  selectedLanguages: string[];
  table: Table<T> | null;
}

interface TableActions<T> {
  setTotalResults: React.Dispatch<React.SetStateAction<number>>;
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setColumnOrder: React.Dispatch<React.SetStateAction<string[]>>;
  setVisibleColumns: React.Dispatch<React.SetStateAction<string[]>>;
  setAppliedFilters: React.Dispatch<React.SetStateAction<TAppliedFilter[]>>;
  setFiltersConfig: React.Dispatch<React.SetStateAction<FiltersProps[]>>;
  setSelectedLanguages: React.Dispatch<React.SetStateAction<string[]>>;
  setTable: (table: Table<T>) => void;
}

interface TableContextType<T> {
  state: TableState<T>;
  actions: TableActions<T>;
}

export function createTableContext<T>() {
  const TableContext = createContext<TableContextType<T> | null>(null);

  function TableProvider({ children }: { children: React.ReactNode }) {
    const [totalResults, setTotalResults] = useState(0);
    const [columns, setColumns] = useState<Column[]>([]);
    const [loading, setLoading] = useState(false);
    const [columnOrder, setColumnOrder] = useState<string[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
    const [appliedFilters, setAppliedFilters] = useState<TAppliedFilter[]>([]);
    const [filtersConfig, setFiltersConfig] = useState<FiltersProps[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
      'en',
    ]);

    const [table, setTable] = useState<Table<T> | null>(null);

    const state: TableState<T> = {
      totalResults,
      columns,
      loading,
      columnOrder,
      visibleColumns,
      appliedFilters,
      filtersConfig,
      selectedLanguages,
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
