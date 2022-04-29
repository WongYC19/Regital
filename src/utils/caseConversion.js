export function snakeToCamel(snakeCase) {
  const textArray = snakeCase.split("_").map((value, index) => {
    if (index === 0) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  });
  return textArray.join("");
}

export function camelToSnake(camelCase) {
  return camelCase.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function snakeToCamelObject(obj) {
  const newObj = {};
  Object.entries(obj ?? {}).forEach((item) => {
    const [key, value] = item;
    const newKey = snakeToCamel(key);
    newObj[newKey] = value;
  });

  return newObj;
}

export function camelToSnakeObject(obj) {
  const newObj = {};
  Object.entries(obj).forEach((item) => {
    const [key, value] = item;
    const newKey = camelToSnake(key);
    newObj[newKey] = value;
  });
  return newObj;
}

export function flattenObject(obj) {
  const flattened = {};

  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      Object.assign(flattened, flattenObject(obj[key]));
    } else {
      flattened[key] = obj[key];
    }
  });

  return flattened;
}

export function objectToArray(obj, includeKey = false) {
  let flattenArray = [...Object.entries(obj)].map((item) => {
    const [field, innerObj] = item;
    if (innerObj["type"] !== "server") return null;
    let value = innerObj["message"];
    if (Array.isArray(value)) value = value.join(", ");
    if (includeKey) return field + ": " + value;
    return value;
  });
  flattenArray = flattenArray.filter((item) => item !== null);
  return flattenArray;
}

export function toTitleCase(txt) {
  return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
}
