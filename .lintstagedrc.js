module.exports = {
  "**/*.{js,jsx,ts,tsx}": ["npx eslint --fix", "npx prettier --write"],

  "**/*.{ts,tsx}": () => "npm run type-check",

  "**/*.{json,md,yml,yaml}": "npx prettier --write",
};
