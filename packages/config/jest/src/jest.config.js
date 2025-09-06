import { pathsToModuleNameMapper } from "ts-jest";
import fs from "node:fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";

const tsconfig = JSON.parse(
  fs.readFileSync(
    new URL("../../../../tsconfig.packages.json", import.meta.url),
    "utf8",
  ),
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = path.resolve(__dirname, "../../../../");

dotenv.config({ path: `${rootDir}/.env.local` });

const mappedPathsToModuleNameWrapper = pathsToModuleNameMapper(
  tsconfig.compilerOptions.paths,
  {
    prefix: "<rootDir>/../..",
  },
);

const appConfig = {
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/__tests__/**",
    "!src/index.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  globals: {
    useESM: true,
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "graphql", "gql", "css"],
  moduleNameMapper: {
    ...mappedPathsToModuleNameWrapper,
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.ts",
    rootDir + "/packages/config/jest/src/jest.setup.base.cjs",
  ],
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/src/**/__tests__/**/*.(test|spec).(ts|tsx)"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          jsx: "react-jsx",
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          moduleResolution: "bundler",
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
};

export default appConfig;
