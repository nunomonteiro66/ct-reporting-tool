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

  const getOrderIndex = (key: string) => {
    if (!key) return;

    const index = orderIndex.get(key);
    if (index === undefined) {
      const keyArray = key.split('.');
      keyArray.pop();
      const newKey = keyArray.join('.');

      return getOrderIndex(newKey);
    }
    return index;
  };

  return [...columns].sort((a, b) => {
    const indexA = getOrderIndex(a.key) ?? Infinity;
    const indexB = getOrderIndex(b.key) ?? Infinity;
    return indexA - indexB;
  });
};
