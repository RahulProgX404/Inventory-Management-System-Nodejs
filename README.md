# Inventory Management System

A production-ready Node.js backend built with Express.js, featuring JWT authentication, validation, logging, and professional architecture.

## Features

✅ **Express.js** - Fast, unopinionated web framework  
✅ **JWT Authentication** - Token-based auth with verification  
✅ **Input Validation** - Zod schema validation  
✅ **Structured Logging** - Winston logger with Morgan HTTP logging  
✅ **Error Handling** - Centralized error handling with custom classes  
✅ **Security** - Helmet headers, rate limiting, CORS protection  
✅ **Code Quality** - ESLint & Prettier configured  
✅ **Request Tracking** - Unique request IDs for tracing  
✅ **Standard Responses** - Consistent JSON response format

## Quick Start

### Prerequisites

- Node.js >= 18
- pnpm (or npm/yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/RahulProgX404/Inventory-Management-System-Nodejs.git
cd node-auth

# Copy environment variables
cp .env.example .env

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

Visit `http://localhost:3000/api/health` to verify the server is running.

```bash
curl http://localhost:3000/api/health
```

## Project Structure

```
src/
├── config/              # Configuration files
│   ├── env.js          # Environment variables with validation
│   └── logger.js       # Winston logger setup
├── constants/          # Application constants
├── http/               # HTTP layer
│   ├── app.js          # Express app setup
│   └── route.js        # Main routes
├── middlewares/        # Express middlewares
│   ├── error-handler.middleware.js
│   ├── request-id.middleware.js
│   ├── response-handler.middleware.js
│   ├── jwt.middleware.js
│   └── validation.middleware.js
├── modules/            # Feature modules
│   └── health/         # Health check module
├── utils/              # Utility functions
│   ├── app-error.js   # Custom error class
│   ├── async-handler.js
│   ├── pagination.js
│   └── crypto.js
└── index.js           # Server entry point
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
LOG_LEVEL=info
JWT_SECRET=your-secret-key-here
```

## Available Scripts

```bash
# Development
pnpm run dev              # Start with nodemon

# Production
pnpm run start           # Run server
pnpm run start:prod      # Production start
pnpm run build           # Build for production
pnpm run preview         # Preview built app

# Code Quality
pnpm run lint            # Run ESLint with --fix
pnpm run format          # Format with Prettier

# Maintenance
pnpm run clean           # Remove dist and logs
```

## API Endpoints

### Health Check

```
GET /api/health
```

Returns server health status.

## Middleware Chain

Requests flow through:

1. **Request ID** - Attach unique request ID
2. **Security Headers** - Helmet
3. **CORS** - Cross-origin handling
4. **Compression** - Response compression
5. **Rate Limiting** - Request throttling
6. **Body Parsing** - JSON/URL-encoded parsing
7. **Response Handler** - Standardized response methods
8. **Routes** - Application routes
9. **Not Found Handler** - 404 handling
10. **Error Handler** - Centralized error handling

## Error Handling

Throw custom errors with status codes:

```javascript
import { AppError } from "#utils/app-error.js";
import { StatusCodes } from "http-status-codes";

throw new AppError("Resource not found", StatusCodes.NOT_FOUND);
```

## Validation Example

Use Zod schemas with validation middleware:

```javascript
import { z } from "zod";
import { validateRequest } from "#middlewares/validation.middleware.js";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

router.post(
  "/users",
  validateRequest(createUserSchema),
  asyncHandler(async (req, res) => {
    const userData = req.validatedData;
    // Handle user creation
    res.success(userData, "User created", StatusCodes.CREATED);
  })
);
```

## Authentication Example

Use JWT middleware for protected routes:

```javascript
import { verifyJWT } from "#middlewares/jwt.middleware.js";

router.get(
  "/profile",
  asyncHandler(verifyJWT),
  asyncHandler(async (req, res) => {
    res.success(req.user, "User profile");
  })
);
```

## Response Format

All responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    /* response data */
  },
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Logging

Winston logger is configured for:

- Console output with colors
- Log level control via `LOG_LEVEL` env var
- HTTP request logging via Morgan

```javascript
import logger from "#config/logger.js";

logger.info("Application started");
logger.error({ err: error }, "Something went wrong");
```

## Best Practices

✅ Use consistent relative imports (`../config/env.js`)  
✅ Wrap async handlers with `asyncHandler()` to catch errors  
✅ Use `res.success()` and `res.error()` for consistent responses  
✅ Validate all user input with Zod schemas  
✅ Throw `AppError` for controlled failures  
✅ Add logging for debugging & monitoring  
✅ Use request ID for tracing across logs  
✅ Always validate environment variables on startup

## Adding Database

When ready to add a database:

1. Install your database client (e.g., `mongoose` for MongoDB is pre-installed)
2. Create database config in `src/config/database.js`
3. Create models in `src/models/`
4. Connect in `src/index.js` before starting server

Example for MongoDB:

```javascript
import mongoose from "mongoose";

await mongoose.connect(env.DATABASE_URL);
logger.info("Connected to MongoDB");
```

## Deployment

### Build

```bash
pnpm run build
```

### Run Built App

```bash
pnpm run preview
```

### Environment Variables for Production

Always set these before deploying:

```bash
NODE_ENV=production
PORT=8080
JWT_SECRET=<use-strong-random-secret>
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_MAX=50
# ... other env vars
```

## License

ISC

## Support

For issues or questions, open a GitHub issue or check the documentation.
