export const extractComposeKeys = (
  obj: Record<string, any>,
  parentKey = ""
): string[] => {
  let keys: string[] = [];

  for (const key in obj) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      keys = keys.concat(extractComposeKeys(obj[key], newKey));
    } else {
      keys.push(newKey);
    }
  }

  return keys;
};
