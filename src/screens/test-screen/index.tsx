import { TableProvider } from '../AllProducts/context';
import TestC from './TestScreen';

export default function TestScreen() {
  return (
    <TableProvider>
      <TestC />
    </TableProvider>
  );
}
