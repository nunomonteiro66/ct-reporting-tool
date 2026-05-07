import { TableProvider } from '../AllProducts/context';
import TestC from './TestScreen';

export default function TestScreen() {
  const initialState = {
    globalFilter: {
      exactMatch: true,
      text: '112382028',
      value: 'sku',
    },
  };

  return (
    <TableProvider initialState={initialState}>
      <TestC />
    </TableProvider>
  );
}
