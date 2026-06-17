export const CONSTANTS = {
  // Authentication
  JWT_EXPIRY: "7d",
  REFRESH_TOKEN_EXPIRY: "30d",

  // Validation
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000,
  RATE_LIMIT_MAX_REQUESTS: 100,

  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,

  // API
  API_VERSION: "v1",
};
