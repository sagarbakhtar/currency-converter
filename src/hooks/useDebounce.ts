import { useState, useEffect } from "react";

const useDebounce = <T>(
  value: T,
  delay: number
) => {
  const [deboundedValue, setDebounded] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounded(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return deboundedValue;
};

export default useDebounce;
