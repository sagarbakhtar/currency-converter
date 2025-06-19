"use client";

import Select from "@/components/Select";
import NumberInput from "@/components/NumberInput";
import InterchangeIcon from "@/components/InterchangeIcon";
import { useState } from "react";
import SpinnerIcon from "@/components/SpinnerIcon";

const CurrencyOptions = ["PLN", "EUR", "GBP", "UAH"];

type CurrencyData = {
  from: string;
  to: string;
  rate: number;
  fromAmount: number;
  toAmount: number;
};
export default function Home() {
  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [toCurrency, setToCurrency] = useState("GBP");
  const [fromAmount, setFromAmount] = useState("1.00");
  const [toAmount, setToAmount] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [interChange, setInterChange] = useState(true);

  const interChangeCurrencies = () => {
    setInterChange((prev) => !prev);
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    if (toAmount) {
      convertCurrency();
    }
  };

  const convertCurrency = async () => {
    setLoading(true);
    const response = await fetch(
      `https://my.transfergo.com/api/fx-rates?from=${fromCurrency}&to=${toCurrency}&amount=${fromAmount}`
    );
    const data: CurrencyData = await response.json();
    setExchangeRate(data.rate.toString());
    setFromAmount(data.fromAmount.toString());
    setToAmount(data.toAmount.toString());
    setLoading(false);
  };

  const filteredOptions = CurrencyOptions.filter(
    (item) => item !== fromCurrency && item !== toCurrency
  );
  return (
    <div className="flex min-h-screen justify-center items-center bg-white">
      <div className="flex gap-20 p-12 shadow-[0_0_10px_2px_rgba(0,0,0,0.25)] w-xl">
        <div className="flex flex-grow flex-col gap-10">
          <div className="flex flex-col gap-8">
            <div className="flex gap-6 items-center">
              <Select
                label="FROM"
                value={fromCurrency}
                options={filteredOptions}
                onChange={(currency) => {
                  setFromCurrency(currency);
                  setToAmount(null);
                }}
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
                onChange={(currency) => {
                  setToCurrency(currency);
                  setToAmount(null);
                }}
              />
            </div>
            <div className="flex gap-14">
              <NumberInput
                label="AMOUNT"
                value={fromAmount}
                currency={fromCurrency}
                onChange={(value) => setFromAmount(value)}
              />
              {toAmount && (
                <NumberInput
                  label="TO"
                  value={toAmount}
                  currency={toCurrency}
                  onChange={(value) => setToAmount(value)}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {!toAmount ? (
              <button
                className={`flex items-center justify-center gap-2 w-full p-5 bg-green-400 rounded-xs text-white ${
                  loading ? "opacity-50" : ""
                }`}
                onClick={() => convertCurrency()}
                disabled={loading}
              >
                {loading && <SpinnerIcon />}
                Convert
              </button>
            ) : (
              <>
                <div className="flex gap-2 items-center">
                  <span className="rounded-full border-3 border-amber-400 w-3 h-3" />
                  <p className="text-lg font-medium">
                    1 {fromCurrency} = {exchangeRate} {toCurrency}
                  </p>
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
