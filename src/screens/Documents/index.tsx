import { TableProvider } from './context';
import Documents from './Documents';

export default function DocumentsScreen() {
  return (
    <TableProvider>
      <Documents />
    </TableProvider>
  );
}
