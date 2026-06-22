export const generateSku = (prefix, count) => {
  return `${prefix}-${String(count + 1).padStart(6, "0")}`;
};

export const formatErrorResponse = (req, message, error = null) => ({
  success: false,
  message,
  errors: error.errors,
  data: null,
  requestId: req.id,
});
