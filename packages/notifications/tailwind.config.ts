import type { Config } from "tailwindcss";
import { tailwindPreset } from "@pkg/config-tailwind";

const config: Config = {
  presets: [tailwindPreset],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],

};

export default config;
