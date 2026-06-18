export const generateSku = (prefix, count) => {
  return `${prefix}-${String(count + 1).padStart(6, "0")}`;
};
