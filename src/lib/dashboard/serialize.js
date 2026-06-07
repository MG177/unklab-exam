export function serialize(value) {
  if (value == null) return value;
  if (Array.isArray(value)) return value.map(serialize);
  if (typeof value.toObject === 'function') {
    return JSON.parse(JSON.stringify(value.toObject()));
  }
  return JSON.parse(JSON.stringify(value));
}
