// Hardcoded JWT secret for simplified deployment.
// This is acceptable for a simple admin panel on a small website.
const HARDCODED_JWT_SECRET = 'bb-apartments-konni-jwt-secret-2026-xK9mP2vR7qL4wN8j'

export function getJwtSecret() {
  // Allow override via env var, but default to hardcoded
  const envSecret = process.env.JWT_SECRET?.trim()
  if (envSecret && envSecret.length >= 32) {
    return envSecret
  }
  return HARDCODED_JWT_SECRET
}

export function isLocalDevelopment() {
  return process.env.NODE_ENV === 'development'
}