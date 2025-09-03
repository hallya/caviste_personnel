import { pathsToModuleNameMapper } from "ts-jest";
import { Config } from "jest";
import { compilerOptions } from "../../../../tsconfig.packages.json";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../../.env.local") });

export const baseConfig = {
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/__tests__/**",
    "!src/index.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "graphql", "gql"],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: "<rootDir>/../..",
    }),
  },
  setupFilesAfterEnv: [
    "<rootDir>/../../packages/config/src/jest.setup.base.ts",
    "<rootDir>/jest.setup.ts",
  ],
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/src/**/__tests__/**/*.(test|spec).(ts|tsx)"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          moduleResolution: "node",
          resolveJsonModule: true,
          isolatedModules: true,
        },
      },
    ],
    "^.+\\.(graphql|gql)$": "jest-transform-graphql",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@vercel/analytics|@vercel/speed-insights)/)",
  ],
} satisfies Config;
