import { baseConfig } from "@pkg/config-jest";
import { Config } from "jest";

const config: Config = {
  ...baseConfig,
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};

export default config;
