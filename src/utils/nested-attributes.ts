// Resolves dot-notation paths like "product.name" on a nested object
export const getNestedValue = (
  obj: Record<string, unknown>,
  path: string
): unknown => {
  return path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object')
      return (acc as Record<string, unknown>)[part];
    return undefined;
  }, obj);
};

export default getNestedValue;
