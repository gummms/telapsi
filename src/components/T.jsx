import { useTranslate } from "../hooks/useTranslate";

/**
 * <T> component — wraps a string child (static OR dynamic) and returns its translated version.
 * Usage: <T>Meu texto em português</T>
 *        <T>{filme.sinopse}</T>
 *
 * Guards against null/undefined from backend data — returns null instead of
 * rendering the literal string "null" or "undefined".
 */
const T = ({ children }) => {
  // Normalise: null, undefined and empty strings are a no-op
  const text =
    children == null || children === ""
      ? ""
      : typeof children === "string"
      ? children
      : String(children);

  const translated = useTranslate(text);

  // Don't render anything for empty / null backend fields
  if (!text) return null;

  return translated;
};

export default T;
