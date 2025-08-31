const baseConfig = require("../../jest.package.base");

module.exports = {
  ...baseConfig,
  moduleNameMapper: {
    "^@pkg/(.*)$": "<rootDir>/../$1/src",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
};
