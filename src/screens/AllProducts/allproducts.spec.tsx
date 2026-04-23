// all-products.spec.tsx
import { screen, waitFor } from '@testing-library/react';
import AllProducts from './AllProductsScreen';
import { TableProvider } from './context';
import { renderApp } from '@commercetools-frontend/application-shell/test-utils';
// mock the hooks
jest.mock('../../hooks/use-products-connector/use-products-graphql', () => ({
  useProductsGraphql: () => ({
    getAllProductTypes: jest
      .fn()
      .mockResolvedValue(require('./__fixtures__/product-types.json')),
    getProducts: jest.fn().mockResolvedValue({
      data: { results: require('./__fixtures__/products.json') },
    }),
    getAllProducts: jest.fn().mockResolvedValue([]),
  }),
}));

jest.mock(
  '../../hooks/use-categories-connector/use-categories-graphql',
  () => ({
    useCategoriesGraphql: () => ({
      getAllCategories: jest
        .fn()
        .mockResolvedValue(require('./__fixtures__/categories.json')),
    }),
  })
);

jest.mock('../../hooks/use-project-connector/use-project-graphql', () => ({
  useProjectGraphql: () => ({
    getAllLanguagesCodes: jest
      .fn()
      .mockResolvedValue(require('./__fixtures__/languages.json')),
  }),
}));

test('renders products table after loading', async () => {
  renderApp(
    <TableProvider>
      <AllProducts />
    </TableProvider>
  );

  // then data loads
  await waitFor(() => screen.getByText('Products'), { timeout: 10000 });
});
