//given the full product selection name, return only the part we want
//f.e Global product selection => Global
export const getProductSelectionsNames = (productSelections: string[]) =>
  productSelections.map((name) => name.split(' ')[0] ?? '');
