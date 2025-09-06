import nextJest from "next/jest.js";
import { baseConfig } from "@pkg/config-jest";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  ...baseConfig,
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/src/app/__tests__/constants/",
  ],
};

const nextConfig = createJestConfig(customJestConfig);

const config = async () => {
  return await nextConfig();
};

export default config;
