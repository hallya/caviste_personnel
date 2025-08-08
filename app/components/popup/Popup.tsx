import PopupContainer from "./containers/PopupContainer";
import type { SimplifiedProduct } from "../../types/shopify";

interface PopupProps {
  title: string;
  onClose: () => void;
  products: SimplifiedProduct[];
  loading: boolean;
  hasNext: boolean;
  onLoadMore: () => void;
  collectionHandle?: string;
  collectionTags?: string[];
}

export default function Popup(props: PopupProps) {
  return <PopupContainer {...props} />;
}
