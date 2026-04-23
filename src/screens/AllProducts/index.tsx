import { TableProvider } from './context';
import AllProducts from './AllProductsScreen';

export default function ProductsScreen() {
  return (
    <TableProvider>
      <AllProducts />
    </TableProvider>
  );
}
