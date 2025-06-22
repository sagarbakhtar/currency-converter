"use client";

import Select from "@/components/Select";
import NumberInput from "@/components/NumberInput";
import InterchangeIcon from "@/components/InterchangeIcon";
import SpinnerIcon from "@/components/SpinnerIcon";
import useConvertCurrency from "@/hooks/useConvertCurrency";
import { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";

const CurrencyOptions = ["PLN", "EUR", "GBP", "UAH"];

type CurrencyData = {
  from: string;
  to: string;
  fromAmount: string;
  toAmount?: string;
};

export default function Home() {
  //Default currency values and control for inputs
  const [currencyData, setCurrencyData] = useState<CurrencyData>({
    from: "EUR",
    to: "GBP",
    fromAmount: "1.00",
  });

  //Debounce values to avoid api calls on each input change
  const debouncedFromAmount = useDebounce(currencyData.fromAmount, 500);
  const debouncedToAmount = useDebounce(currencyData.toAmount, 500);

  //api hook used for currency conversion
  const { loading, dataFetched, apiData, errors, convertCurrency } =
    useConvertCurrency({
      from: currencyData.from,
      to: currencyData.to,
      fromAmount: debouncedFromAmount,
      toAmount: debouncedToAmount,
      fetchDataOnLoad: false,
    });

  const setData = (key: string, value: string) => {
    setCurrencyData((prev) => ({ ...prev, [key]: value }));
  };

  const interChangeCurrencies = () => {
    setCurrencyData((prev) => ({ ...prev, from: prev.to, to: prev.from }));
  };

  //Update currency controls value based on api data
  useEffect(() => {
    if (!dataFetched || !apiData) return;
    setCurrencyData((prev) => ({
      ...prev,
      fromAmount: apiData.fromAmount.toString(),
      toAmount: apiData.toAmount.toString(),
    }));
  }, [dataFetched, apiData]);

  const filteredOptions = CurrencyOptions.filter(
    (item) => item !== currencyData.from && item !== currencyData.to
  );

  return (
    <div className="flex min-h-screen justify-center items-center bg-white">
      <div className="flex gap-20 p-12 shadow-[0_0_10px_2px_rgba(0,0,0,0.25)] w-xl">
        <div className="flex flex-grow flex-col gap-10">
          <div className="flex flex-col gap-8">
            <div className="flex gap-6 items-center">
              <Select
                label="FROM"
                value={currencyData.from}
                options={filteredOptions}
                onChange={(currency) => setData("from", currency)}
              />

              <div className="pt-5">
                <button
                  className="w-6 fill-sky-400 cursor-pointer transition-transform active:rotate-180"
                  onClick={interChangeCurrencies}
                >
                  <InterchangeIcon />
                </button>
              </div>

              <Select
                label="TO"
                value={currencyData.to}
                options={filteredOptions}
                onChange={(currency) => setData("to", currency)}
              />
            </div>

            <div className="flex gap-14">
              <NumberInput
                label="AMOUNT"
                value={currencyData.fromAmount}
                currency={currencyData.from}
                onChange={(value) => setData("fromAmount", value)}
                errorMessage={errors?.fromAmount}
              />
              {dataFetched && (
                <NumberInput
                  label="TO"
                  value={currencyData.toAmount || ""}
                  currency={currencyData.to}
                  onChange={(value) => setData("toAmount", value)}
                  errorMessage={errors?.toAmount}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {dataFetched && apiData ? (
              <>
                <div className="flex gap-2 items-center">
                  <span className="rounded-full border-3 border-amber-400 w-3 h-3" />
                  <p className="text-lg font-medium">
                    {`1 ${apiData.from} = ${apiData?.rate} ${apiData.to}`}
                  </p>
                </div>
                <p className="text-xs text-gray-400 font-thin">
                  All figures are live mid-market rates, which are for
                  informational purposes only. <br /> To see the rates for money
                  transfer, please select sending money option.
                </p>
              </>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
