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

//flattens the columns and returns the keys
export const flattenColumnKeys = (cols: Column[], parentKey = ''): string[] => {
  return cols.flatMap((col) => {
    const fullKey = parentKey ? `${parentKey}.${col.key}` : col.key;
    if (col.children && col.children.length > 0) {
      return flattenColumnKeys(col.children, fullKey);
    }
    return [fullKey];
  });
};

export const flattenColumnKeysByLanguage = (
  cols: Column[],
  languages: string[],
  parentKey = '',
  depth = 0
): string[] => {
  return cols.flatMap((col) => {
    const fullKey = parentKey ? `${parentKey}.${col.key}` : col.key;

    // Only filter by language at depth 1 (direct children of root)
    if (depth === 1 && !languages.includes(col.key)) return [];

    if (col.children && col.children.length > 0) {
      return flattenColumnKeysByLanguage(
        col.children,
        languages,
        fullKey,
        depth + 1
      );
    }
    return [fullKey];
  });
};
export const flattenColumns = (cols: Column[], parentKey = '') =>
  cols.flatMap((col) => {
    const fullKey = parentKey ? `${parentKey}.${col.key}` : col.key;
    if (col.children && col.children.length > 0)
      return flattenColumns(col.children, fullKey);
    return { ...col, key: fullKey };
  });
