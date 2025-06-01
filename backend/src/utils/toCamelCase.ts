// Utility type to convert snake_case keys to camelCase
type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S;

// Recursively convert all keys in an object from snake_case to camelCase
type CamelCaseKeys<T> = T extends readonly (infer U)[]
  ? CamelCaseKeys<U>[]
  : T extends Record<string, any>
    ? {
        [K in keyof T as SnakeToCamelCase<K & string>]: CamelCaseKeys<T[K]>;
      }
    : T;

export default function toCamelCase<T>(obj: T): CamelCaseKeys<T> {
  if (obj === null || typeof obj !== "object") {
    return obj as CamelCaseKeys<T>;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelCase(item)) as CamelCaseKeys<T>;
  }

  const camelCaseObj: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    // Convert snake_case to camelCase
    const camelKey = key.replace(/_([a-z])/g, (match, letter) =>
      letter.toUpperCase(),
    );

    // Recursively convert nested objects/arrays
    camelCaseObj[camelKey] = toCamelCase(value);
  }

  return camelCaseObj as CamelCaseKeys<T>;
}
