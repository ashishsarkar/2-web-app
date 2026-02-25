// Run before test framework; ensures apiClient (axios) uses this base URL so MSW can intercept
process.env.NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost';
