// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@vercel/analytics$': '<rootDir>/jest.setup.ts',
    '^@vercel/analytics/react$': '<rootDir>/jest.setup.ts',
    '^@vercel/speed-insights/next$': '<rootDir>/jest.setup.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@vercel/analytics|@vercel/speed-insights)/)',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/app/__tests__/constants/',
    '<rootDir>/app/__tests__/factories/',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
