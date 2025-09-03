import PopupContainer from "./containers/PopupContainer";

interface PopupProps {
  title: string;
  onClose: () => void;
  collectionHandle: string;
  collectionTags: string[] | null;
}

export default function Popup(props: PopupProps) {
  return <PopupContainer {...props} />;
}
