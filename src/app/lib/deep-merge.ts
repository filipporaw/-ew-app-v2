type ObjectType = { [key: string]: any };

const isObject = (item: any): item is ObjectType => {
  return item && typeof item === "object" && !Array.isArray(item);
};

/**
 * Deep merge two objects by overriding target with fields in source.
 * It returns a new object and doesn't modify any object in place.
 */
export const deepMerge = (target: any, source: any, level = 0): any => {
  if (!target && level === 0) {
    return source;
  }
  
  if (!source) {
    return target;
  }

  // Handle non-object types or null
  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  const result: ObjectType = Array.isArray(target) ? [...target] : { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (isObject(sourceValue) && isObject(targetValue)) {
        result[key] = deepMerge(targetValue, sourceValue, level + 1);
      } else {
        result[key] = sourceValue;
      }
    }
  }

  return result;
};
