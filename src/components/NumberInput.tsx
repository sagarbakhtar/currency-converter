"use client";

import { useState } from "react";

type NumberInputProps = {
  label: string;
  value: number;
  currency: string;
  errorMessage?: string;
};

const NumberInput = ({
  label,
  value,
  currency,
  errorMessage,
}: NumberInputProps) => {
  const [number, setNumber] = useState(value.toFixed(2));
  return (
    <div className="flex flex-col gap-3 flex-grow">
      <label className="text-xs font-light text-gray-400">{label}:</label>
      <div className="flex flex-col gap-1">
        <div className="flex flex-grow border-b border-blue-200 items-center">
          <div className="flex flex-grow">
            <input
              size={1}
              className="outline-none flex w-full font-semibold text-2xl"
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
          <span className="text-gray-500">{currency}</span>
        </div>
        <p className="h-4 text-sm/4 text-red-500">{errorMessage}</p>
      </div>
    </div>
  );
};

export default NumberInput;
