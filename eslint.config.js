// eslint-disable-next-line @typescript-eslint/no-require-imports
const { FlatCompat } = require("@eslint/eslintrc");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const js = require("@eslint/js");

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  {
    ignores: [
      "node_modules/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/.turbo/**",
      "coverage/**",
    ],
  },
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        React: "readonly",
        JSX: "readonly",
      },
    },
    settings: {
      next: {
        rootDir: ["apps/caviste-app/"],
      },
    },
    rules: {
      "@next/next/no-html-link-for-pages": [
        "error",
        "apps/caviste-app/src/app",
      ],
    },
  },
];
