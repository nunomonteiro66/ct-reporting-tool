// screens/ProductsScreen/context.ts
import { createTableContext } from '../_context/TableContext';
import { MappedProduct } from '../../types/mapped-product';

export const { TableProvider, useTableContext } =
  createTableContext<MappedProduct>();
