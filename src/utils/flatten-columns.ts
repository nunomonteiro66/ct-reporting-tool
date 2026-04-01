import { Column } from '../types/datatable-column';

/* const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    {
      key: 'attributes',
      label: 'Attributes',
      children: [
        { key: 'en', label: 'en' },
        { key: 'pt', label: 'pt' },
      ],
    },
  ]; 
  
  transforms into

  [ "id", "name", "attributes.en", "attributes.pt" ]
  
  */

const flattenColumns = (cols: Column[], parentKey = ''): string[] => {
  return cols.flatMap((col) => {
    const fullKey = parentKey ? `${parentKey}.${col.key}` : col.key;
    if (col.children && col.children.length > 0) {
      return flattenColumns(col.children, fullKey);
    }
    return [fullKey];
  });
};

export default flattenColumns;
