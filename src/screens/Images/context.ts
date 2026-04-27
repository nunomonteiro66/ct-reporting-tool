import { ImageProduct } from '../../types/images';
import { createTableContext } from '../_context/TableContext';

export const { TableProvider, useTableContext } =
  createTableContext<ImageProduct>();
