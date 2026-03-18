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
