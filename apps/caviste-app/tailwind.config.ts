import { tailwindPreset } from "@pkg/config-tailwind";

const config = {
  presets: [tailwindPreset],
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/cart/src/**/*.{ts,tsx}",
    "../../packages/catalog/src/**/*.{ts,tsx}",
    "../../packages/design-system/src/**/*.{ts,tsx}",
    "../../packages/notifications/src/**/*.{ts,tsx}",
  ],
};
export default config;
console.log("✅ Tailwind config loaded");
