const baseConfig = require("../../jest.package.base");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  ...baseConfig,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/src/app/__tests__/constants/",
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
const nextConfig = createJestConfig(customJestConfig);

// Wrap to ensure our moduleNameMapper is preserved
module.exports = async () => {
  const config = await nextConfig();
  return {
    ...config,
    moduleNameMapper: {
      ...config.moduleNameMapper,
      "^@pkg/(.*)$": "<rootDir>/../../packages/$1/src",
    },
  };
};
