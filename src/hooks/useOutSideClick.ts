import { RefObject, useCallback, useEffect, useRef } from "react";

const useOutSideClick = (
  ref: RefObject<HTMLElement | null>,
  callback: () => void
) => {
  const outerRef = useRef<HTMLElement>(null);

  const handleOuterClick = useCallback(
    (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        callback();
      }
    },
    [ref, callback]
  );

  useEffect(() => {
    document.addEventListener("mouseup", handleOuterClick);
    return () => document.removeEventListener("mouseup", handleOuterClick);
  }, [handleOuterClick]);

  return outerRef;
};

export default useOutSideClick;
