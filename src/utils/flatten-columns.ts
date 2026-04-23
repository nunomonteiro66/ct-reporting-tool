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
  parentKey = ''
): string[] => {
  return cols.flatMap((col) => {
    const fullKey = parentKey ? `${parentKey}.${col.key}` : col.key;

    if (parentKey != '' && !languages.includes(col.key)) return [];

    if (col.children && col.children.length > 0) {
      return flattenColumnKeysByLanguage(col.children, languages, fullKey);
    }

    return [fullKey];
  });
};

export const flattenColumns = (cols: Column[]) =>
  cols.flatMap((col) => [col, ...(col.children ?? [])]);
