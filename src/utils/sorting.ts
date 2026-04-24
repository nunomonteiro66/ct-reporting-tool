export const sortByKeyOrder = <T extends object>(
  items: T[],
  orderedKeys: string[],
  keyField: keyof T
): T[] => {
  return [...items].sort((a, b) => {
    const aIndex = orderedKeys.indexOf(a[keyField] as string);
    const bIndex = orderedKeys.indexOf(b[keyField] as string);
    return aIndex - bIndex;
  });
};

//sets the order of the columns the same as the columnsOrder
export const orderColumnsByKeys = <T extends { key: string }>(
  columns: T[],
  columnsOrder: string[]
) => {
  const orderIndex = new Map<string, number>(
    columnsOrder.map((key, index) => [key, index])
  );

  const getOrderIndex = (key: string): number | undefined => {
    if (!key) return undefined; // base case — stop recursion

    const index = orderIndex.get(key);
    if (index !== undefined) return index;

    // strip last segment and try parent key
    const lastDot = key.lastIndexOf('.');
    if (lastDot === -1) return undefined; // no more segments to strip

    return getOrderIndex(key.slice(0, lastDot));
  };

  return [...columns].sort((a, b) => {
    const indexA = getOrderIndex(a.key) ?? Infinity;
    const indexB = getOrderIndex(b.key) ?? Infinity;
    return indexA - indexB;
  });
};
