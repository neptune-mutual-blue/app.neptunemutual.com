/**
 * Inspiration: https://github.com/damikun/React-Toast
 * Author: Dalibor Kundrat  https://github.com/damikun
 */
import React, { useContext } from "react";

/**
 * Global and Helpers
 */
export const ToastContext = React.createContext({
  /** @type {Function} */
  pushError: () => {},
  
  /** @type {Function} */
  pushWarning: () => {},
  
  /** @type {Function} */
  pushSuccess: () => {},
  
  /** @type {Function} */
  pushInfo: () => {},
  
  /** @type {Function} */
  pushLoading: () => {},
  
  /** @type {Function} */
  push: () => {},
  
  /** @type {Function} */
  pushCustom: () => {},
  
  /** @type {Function} */
  remove: (_id) => {},
});

export const useToast = () => useContext(ToastContext);
