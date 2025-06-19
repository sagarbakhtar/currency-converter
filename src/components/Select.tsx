"use client";

import { useRef, useState } from "react";
import CurrencyFlagIcon from "@/components/CurrencyIcon";
import useOutSideClick from "@/hooks/useOutSideClick";
import AngleDownIcon from "./AngleDownIcon";

type SelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (currency: string) => void;
};

const Select = ({ label, value, options, onChange }: SelectProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const contianerRef = useRef<HTMLDivElement>(null);

  useOutSideClick(contianerRef, () => {
    if (showOptions) {
      setShowOptions(false);
    }
  });
  
  return (
    <div ref={contianerRef} className="relative flex flex-grow flex-col gap-2">
      <label className="text-xs font-light text-gray-400">{label}:</label>
      <div
        className="flex items-center border-b border-blue-200 cursor-pointer pb-1 justify-between"
        onClick={() => setShowOptions((prev) => !prev)}
      >
        <div className="flex items-center gap-2">
          <CurrencyFlagIcon currency={value} />
          <span className="font-medium text-xl">{value}</span>
        </div>
        <span
          className={`${
            showOptions ? "rotate-180" : ""
          } w-3 transition-transform`}
        >
          <AngleDownIcon />
        </span>
      </div>
      <ul
        className={`${
          showOptions ? "opacity-100 z-10" : "opacity-0 -z-10"
        } absolute transition-opacity top-full w-full bg-white border border-t-0 border-gray-300 rounded-xs divide-y shadow-sm text-sm`}
      >
        {options.map((option) => {
          if (option === value) return null;

          return (
            <li
              className="p-2 border-gray-100 flex gap-2 items-center text-sm/4 cursor-pointer"
              key={option}
              onClick={() => {
                onChange(option);
                setShowOptions(false)
              }}
            >
              <CurrencyFlagIcon currency={option} size="medium" />
              {option}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default Select;
