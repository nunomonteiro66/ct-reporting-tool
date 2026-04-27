import { TableProvider } from './context';
import Images from './Images';

export default function ImagesScreen() {
  return (
    <TableProvider>
      <Images />
    </TableProvider>
  );
}
