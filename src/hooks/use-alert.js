import { alertContext } from "@/lib/contexts";
import { useContext } from "react";

export function useAlert() {
  const [
    content,
    setContent,
    showOnPopup,
    setShowOnPopup,
    showCloseButton,
    setShowCloseButton,
    isAlertOpen,
    setIsAlertOpen,
  ] = useContext(alertContext);

  /** @typedef {{showOnPopup?: boolean, showCloseButton?: boolean}} AlertOptions */

  /**
   * @param {any} content
   * @param {AlertOptions} options
   */
  const showAlert = (
    content,
    options = {
      showOnPopup: false,
      showCloseButton: true,
    }
  ) => {
    setContent(content);
    setShowOnPopup(options.showOnPopup ?? false);
    setShowCloseButton(options.showCloseButton ?? true);
    setIsAlertOpen(true);
  };

  const closeAlert = () => {
    setIsAlertOpen(false);
  };

  return {
    content,
    showOnPopup,
    showCloseButton,
    isOpen: isAlertOpen,
    showAlert,
    closeAlert,
  };
}
