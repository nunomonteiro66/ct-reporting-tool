import { TableProvider } from './context';
import AllProducts from './AllProductsScreen';
import { mockColumns } from './tests/columns';

export default function ProductsScreen() {
  return (
    <TableProvider>
      <AllProducts />
    </TableProvider>
  );
}
