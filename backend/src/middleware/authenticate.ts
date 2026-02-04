// Re-export authentication middleware from auth.ts
// This provides compatibility for routes that import from './middleware/authenticate'
export { authenticate, optionalAuthenticate, authorize } from './auth.js';
