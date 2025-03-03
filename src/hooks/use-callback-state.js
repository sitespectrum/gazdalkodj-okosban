import { useEffect, useRef, useState } from "react";

/** @typedef {import('../lib/types').CallbackState} CallbackState */

/**
 * A custom hook that extends useState with callback support
 * @template T
 * @param {T} initialValue - The initial state value
 * @returns {CallbackState<T>} A tuple containing:
 *   - The current state value
 *   - A setState function that accepts either a new value, an updater function, and an optional callback
 * @example
 * // Direct value update
 * const [count, setCount] = useCallbackState(0);
 * setCount(1, (v) => console.log('Count updated:', v));
 *
 * // Updater function
 * setCount(prev => prev + 1, (v) => console.log('Count incremented:', v));
 */
export const useCallbackState = (initialValue) => {
  const [state, _setState] = useState(initialValue);
  const callbackQueue = useRef([]);
  useEffect(() => {
    callbackQueue.current.forEach((cb) => cb(state));
    callbackQueue.current = [];
  }, [state]);
  const setState = (newValueOrUpdater, callback) => {
    _setState((prevState) => {
      const newState =
        typeof newValueOrUpdater === "function"
          ? newValueOrUpdater(prevState)
          : newValueOrUpdater;

      if (callback && typeof callback === "function") {
        callbackQueue.current.push(callback);
      }

      return newState;
    });
  };
  return [state, setState];
};
