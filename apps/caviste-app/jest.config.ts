import nextJest from "next/jest";
import { baseConfig } from "@pkg/config-jest";

const createJestConfig = nextJest({
  dir: "./",
});

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

const nextConfig = createJestConfig(customJestConfig);

module.exports = async () => {
  const config = await nextConfig();
  return {
    ...config,
    moduleNameMapper: {
      ...config.moduleNameMapper,
      "^@pkg/(.*)$": "<rootDir>/../../packages/$1/src",
    }
  };
};
