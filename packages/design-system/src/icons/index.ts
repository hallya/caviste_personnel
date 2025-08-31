import BottleIcon from "./BottleIcon";
import BoxOfBottlesIcon from "./BoxOfBottlesIcon";
import SuccessIcon from "./SuccessIcon";
import LoadingIcon from "./LoadingIcon";
import ErrorIcon from "./ErrorIcon";
import CloseIcon from "./CloseIcon";
import NotificationIcon from "./NotificationIcon";
import InstagramIcon from "./InstagramIcon";
import FacebookIcon from "./FacebookIcon";
import ImageIcon from "./ImageIcon";
import SortIcon from "./SortIcon";
import SortOrderIcon from "./SortOrderIcon";
import SearchIcon from "./SearchIcon";
import ClearIcon from "./ClearIcon";

export const iconMap = {
  bottle: BottleIcon,
  "box-of-bottles": BoxOfBottlesIcon,
  success: SuccessIcon,
  loading: LoadingIcon,
  error: ErrorIcon,
  close: CloseIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  image: ImageIcon,
  sort: SortIcon,
  "sort-order": SortOrderIcon,
  search: SearchIcon,
  clear: ClearIcon,
} as const;

export type IconName = keyof typeof iconMap;

export {
  BottleIcon,
  BoxOfBottlesIcon,
  SuccessIcon,
  LoadingIcon,
  ErrorIcon,
  CloseIcon,
  NotificationIcon,
  InstagramIcon,
  FacebookIcon,
  ImageIcon,
  SortIcon,
  SortOrderIcon,
  SearchIcon,
  ClearIcon,
};
