/**
 * Application configuration
 * Centralizes environment-dependent settings
 */

// Validate required environment variables
const requiredEnvVars = {
  GATSBY_API_URL: process.env.GATSBY_API_URL,
};

// Check for missing required variables (only in browser/development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const missing = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error(
      `Missing required environment variables:\n${missing.join('\n')}\n\n` +
      `Please create a .env.development file with:\n` +
      `GATSBY_API_URL=http://localhost:3001/api`
    );
  }
}

const config = {
  // API base URL (without trailing slash)
  apiUrl: process.env.GATSBY_API_URL || '',
};

export default config;
