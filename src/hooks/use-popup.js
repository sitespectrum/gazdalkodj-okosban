//@ts-check
import { useContext } from "react";
import { popupContext } from "../lib/contexts.js";

export function usePopup() {
  const [popupClass, setPopupClass, popupContent, setPopupContent] =
    useContext(popupContext);

  const openPopup = (popupClass, popupContent) => {
    setPopupClass(popupClass);
    setPopupContent(popupContent);
  };

  const closePopup = () => {
    setPopupClass("");
    setPopupContent(null);
  };

  return { popupClass, popupContent, openPopup, closePopup };
}
