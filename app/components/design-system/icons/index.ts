import BottleIcon from "./BottleIcon";
import BoxOfBottlesIcon from "./BoxOfBottlesIcon";

export const iconMap = {
  bottle: BottleIcon,
  "box-of-bottles": BoxOfBottlesIcon,
} as const;

export type IconName = keyof typeof iconMap;

export { BottleIcon, BoxOfBottlesIcon }; 