import { DependencyList, useEffect } from "react";

const useDebounceEffect = (
  callback: () => void,
  dependencies: DependencyList,
  delay: number
) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      callback();
    }, delay);

    return () => clearTimeout(timer);
  }, dependencies);
};

export default useDebounceEffect;
