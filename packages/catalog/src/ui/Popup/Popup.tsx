import PopupContainer from "./containers/PopupContainer";
import type { Product } from "@pkg/domain";

interface PopupProps {
  title: string;
  onClose: () => void;
  products: Product[];
  loading: boolean;
  hasNext: boolean;
  onLoadMore: () => void;
  collectionHandle?: string;
  collectionTags: string[] | null;
}

export default function Popup(props: PopupProps) {
  return <PopupContainer {...props} />;
}
