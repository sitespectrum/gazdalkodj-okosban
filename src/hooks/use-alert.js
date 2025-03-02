//@ts-check
import { useContext } from "react";
import { alertContext } from "../lib/contexts";

export function useAlert() {
  const [
    content,
    setContent,
    showOnPopup,
    setShowOnPopup,
    showCloseButton,
    setShowCloseButton,
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
    console.log("showAlert", content);
    console.log(options);
    setContent(content);
    setShowOnPopup(options.showOnPopup ?? false);
    setShowCloseButton(options.showCloseButton ?? true);
  };

  const closeAlert = () => {
    setContent(null);
    setShowOnPopup(false);
    setShowCloseButton(true);
  };

  return {
    content,
    showOnPopup,
    showCloseButton,
    showAlert,
    closeAlert,
  };
}
