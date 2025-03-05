//@ts-check
import { useContext } from "react";
import { popupContext } from "../lib/contexts.js";

export function usePopup() {
  const [
    popupClass,
    setPopupClass,
    popupContent,
    setPopupContent,
    isOpen,
    setIsOpen,
  ] = useContext(popupContext);

  const openPopup = (popupClass, popupContent) => {
    setPopupClass(popupClass);
    setPopupContent(popupContent);
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  return { popupClass, popupContent, isOpen, openPopup, closePopup };
}
