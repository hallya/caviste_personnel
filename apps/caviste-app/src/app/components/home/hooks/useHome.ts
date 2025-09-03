import { useCallback, useState } from "react";
import { useCollections } from "./useCollections";

export function useHome() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupHandle, setPopupHandle] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [popupCollectionTags, setPopupCollectionTags] = useState<
    string[] | null
  >(null);

  const { collections, isLoadingCollections, collectionsError } =
    useCollections();

  const openCollection = useCallback(
    async (
      handle: string,
      title: string,
      collectionTags: string[] | null,
    ) => {
      setIsPopupOpen(true);
      setPopupHandle(handle);
      setPopupTitle(title);
      setPopupCollectionTags(collectionTags);
      
    },
    [
      setPopupHandle,
      setPopupTitle,
      setPopupCollectionTags,
    ]
  );

  const closePopup = useCallback(() => {
    setIsPopupOpen(false);
  }, [setIsPopupOpen]);

  return {
    collections,
    isLoadingCollections,
    collectionsError,
    isPopupOpen,
    popupTitle,
    popupHandle,
    popupCollectionTags,
    openCollection,
    closePopup,
  };
}
