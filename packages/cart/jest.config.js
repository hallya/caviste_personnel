const baseConfig = require("../../jest.package.base");

/** @type {import('jest').Config} */
module.exports = {
  ...baseConfig,
  roots: ["<rootDir>/src"],
  moduleNameMapper: Object.assign(
    {},
    baseConfig.moduleNameMapper || {},
    {
      "^@vercel/speed-insights/react$": "<rootDir>/src/__mocks__/speed-insights-react.ts",
      "^@pkg/analytics(?:/.*)?$": "<rootDir>/src/__mocks__/analytics.ts",
      "^@pkg/(.*)$": "<rootDir>/../$1/src",
    }
  ),
  transformIgnorePatterns: [
    ...(baseConfig.transformIgnorePatterns || []),
    "/node_modules/(?!(?:@vercel/speed-insights)/)",
  ],
  testMatch: ["**/__tests__/**/*.test.(ts|tsx)"],
  setupFilesAfterEnv: [
    ...(baseConfig.setupFilesAfterEnv || []),
    "<rootDir>/jest.setup.ts",
  ],
};
