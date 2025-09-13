/*
 * HIJRA KYC FRONTEND - API CONSTANTS
 * 
 * FILE TYPE: Configuration/Constants
 * PURPOSE: Centralized API configuration constants
 * 
 * FUNCTIONALITY:
 * - Defines base URL for all API calls
 * - Provides environment-specific API endpoints
 * - Currently configured for local development (localhost:9090)
 * - Contains commented production/network URL option
 * 
 * USAGE:
 * - Imported by axios.ts for API instance configuration
 * - Used by Authentication.ts for direct API calls
 * - Allows easy switching between development and production environments
 */

export const BASE_URL="http://localhost:9090"
 //export const BASE_URL="http://192.168.216.62:9090"
