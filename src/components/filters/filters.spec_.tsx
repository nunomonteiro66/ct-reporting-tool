import { fireEvent, render, screen } from '@testing-library/react';
import FiltersComponent, { FiltersProps } from './filters';
import { IntlProvider } from 'react-intl';

/* describe('Filters component', () => {
  const RenderFilters = (
    filtersConfig: FiltersProps[],
    appliedFilters: Record<string, string[]>
  ) => {
    render(
      <IntlProvider locale="en">
        <FiltersComponent
          appliedFilters={appliedFilters}
          filtersConfig={filtersConfig}
          submitCallback={() => {}}
          clearAllCallback={() => {}}
        />
      </IntlProvider>
    );
  };

  it('renders correctly', () => {
    const filtersConfig = [
      {
        filterKey: 'filter1',
        label: 'Filter-1',
        options: [
          { value: '1', label: '1' },
          { value: '2', label: '2' },
          { value: '3', label: '3' },
        ],
      },
    ];

    const appliedFilters = { filter1: ['1', '2'] };

    const onChange = jest.fn();

    RenderFilters(filtersConfig, appliedFilters);

    const filterBtn = screen.getByRole('button', { name: 'Filters' });
    fireEvent.click(filterBtn);

    const filters1 = screen.getByRole('button', { name: 'Filter-1:' });
    fireEvent.click(filters1);

    const option3 = screen.getByRole('option', { name: '3' });
    fireEvent.click(option3);

    const apply = screen.getByRole('button', { name: 'Apply' });
    fireEvent.click(apply);

    const selectedValues = screen.getByLabelText(
      'Filter-1 selected values'
    ).textContent;

    expect(selectedValues).toEqual(['1', '2', '3']);
  });
}); */
