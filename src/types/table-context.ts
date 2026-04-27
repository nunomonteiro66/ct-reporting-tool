import { TAppliedFilter } from '@commercetools-uikit/filters';
import { Column } from './datatable-column';
import { FiltersProps } from '../components/filters/filters';
import { PaginationState, Table } from '@tanstack/react-table';

export interface TableState<T> {
  totalResults: number;
  columns: Column[];
  loading: boolean;
  columnOrder: string[];
  visibleColumns: string[];
  appliedFilters: TAppliedFilter[];
  filtersConfig: FiltersProps[];
  selectedLanguages: string[];
  pagination: PaginationState;
  table: Table<T> | null;
}

export interface TableActions<T> {
  setTotalResults: React.Dispatch<React.SetStateAction<number>>;
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setColumnOrder: React.Dispatch<React.SetStateAction<string[]>>;
  setVisibleColumns: React.Dispatch<React.SetStateAction<string[]>>;
  setAppliedFilters: React.Dispatch<React.SetStateAction<TAppliedFilter[]>>;
  setFiltersConfig: React.Dispatch<React.SetStateAction<FiltersProps[]>>;
  setSelectedLanguages: React.Dispatch<React.SetStateAction<string[]>>;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  setTable: (table: Table<T>) => void;
}

export interface TableContextType<T> {
  state: TableState<T>;
  actions: TableActions<T>;
}
