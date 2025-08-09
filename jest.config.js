// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/app/__tests__/constants/",
    "<rootDir>/app/__tests__/factories/",
  ],
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}",
    "!app/**/*.d.ts",
    "!app/**/*.stories.{js,jsx,ts,tsx}",
    "!app/__tests__/constants/**/*.{js,jsx,ts,tsx}",
    "!app/__tests__/factories/**/*.{js,jsx,ts,tsx}",
  ],
  testRunner: "jest-circus/runner",
};

module.exports = createJestConfig(customJestConfig);
