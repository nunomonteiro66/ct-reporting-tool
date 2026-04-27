import { DocumentProduct } from '../../types/documents';
import { createTableContext } from '../_context/TableContext';

export const { TableProvider, useTableContext } =
  createTableContext<DocumentProduct>();
