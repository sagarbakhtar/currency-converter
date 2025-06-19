"use client";

import Select from "@/components/Select";
import NumberInput from "@/components/NumberInput";
import InterchangeIcon from "@/components/InterchangeIcon";
import { useState } from "react";

const CurrencyOptions = ["PLN", "EUR", "GBP", "UAH"];

export default function Home() {
  const [showButton, setShowButton] = useState(true);
  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [toCurrency, setToCurrency] = useState("GBP");
  const [interChange, setInterChange] = useState(true);

  const interChangeCurrencies = () => {
    setInterChange((prev) => !prev);
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const filteredOptions = CurrencyOptions.filter(
    (item) => item !== fromCurrency && item !== toCurrency
  );
  return (
    <div className="flex min-h-screen justify-center items-center bg-white">
      <div className="flex gap-20 p-12 shadow-[0_0_10px_2px_rgba(0,0,0,0.25)] max-w-xl">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-8">
            <div className="flex gap-6 items-center">
              <Select
                label="FROM"
                value={fromCurrency}
                options={filteredOptions}
                onChange={(currency) => setFromCurrency(currency)}
              />

              <button
                className="pt-5 w-6 fill-sky-400 cursor-pointer"
                onClick={interChangeCurrencies}
              >
                <InterchangeIcon rotate={interChange} />
              </button>

              <Select
                label="TO"
                value={toCurrency}
                options={filteredOptions}
                onChange={(currency) => setToCurrency(currency)}
              />
            </div>
            <div className="flex gap-14">
              <NumberInput label="AMOUNT" value={1.0} currency="EUR" />
              <NumberInput label="AMOUNT" value={1.0} currency="EUR" />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {showButton ? (
              <button
                className="w-full p-5 bg-green-400 rounded-xs text-white"
                onClick={() => setShowButton(false)}
              >
                Convert
              </button>
            ) : (
              <>
                <div className="flex gap-2 items-center">
                  <span className="rounded-full border-3 border-amber-400 w-3 h-3" />
                  <p className="text-lg font-medium">1 EUR = 0.9224 GBP</p>
                </div>
                <p className="text-xs text-gray-400 font-thin">
                  All figures are live mid-market rates, which are for
                  informational purposes only.
                  <br />
                  To see the rates for money transfer, please select sending
                  money option.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
