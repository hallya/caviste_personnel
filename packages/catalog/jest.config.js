const baseConfig = require("../../jest.package.base");

/** @type {import('jest').Config} */
module.exports = {
  ...baseConfig,
  roots: ["<rootDir>/src"],
  moduleNameMapper: Object.assign(
    {},
    baseConfig.moduleNameMapper || {},
    {
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
