"use client";

import Select from "@/components/Select";
import NumberInput from "@/components/NumberInput";
import InterchangeIcon from "@/components/InterchangeIcon";
import SpinnerIcon from "@/components/SpinnerIcon";
import useCurrencyData from "@/hooks/useCurrencyData";

const CurrencyOptions = ["PLN", "EUR", "GBP", "UAH"];

export default function Home() {
  const {
    loading,
    dataFetched,
    currencyData,
    convertCurrency,
    setFromCurrency,
    setToCurrency,
    setFromAmount,
    setToAmount,
    interChangeCurrencies,
    errors
  } = useCurrencyData({
    defaultFrom: "EUR",
    defaultTo: "GBP",
    defaultAmount: "1.00",
  });

  const filteredOptions = CurrencyOptions.filter(
    (item) =>
      item !== currencyData.fromCurrency && item !== currencyData.toCurrency
  );
  return (
    <div className="flex min-h-screen justify-center items-center bg-white">
      <div className="flex gap-20 p-12 shadow-[0_0_10px_2px_rgba(0,0,0,0.25)] w-xl">
        <div className="flex flex-grow flex-col gap-10">
          <div className="flex flex-col gap-8">
            <div className="flex gap-6 items-center">
              <Select
                label="FROM"
                value={currencyData.fromCurrency}
                options={filteredOptions}
                onChange={(currency) => setFromCurrency(currency)}
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
                value={currencyData.toCurrency}
                options={filteredOptions}
                onChange={(currency) => setToCurrency(currency)}
              />
            </div>

            <div className="flex gap-14">
              <NumberInput
                label="AMOUNT"
                value={currencyData.fromAmount}
                currency={currencyData.fromCurrency}
                onChange={(value) => setFromAmount(value)}
                errorMessage={errors?.fromAmount}
              />
              {dataFetched && (
                <NumberInput
                  label="TO"
                  value={currencyData.toAmount}
                  currency={currencyData.toCurrency}
                  onChange={(value) => setToAmount(value)}
                  errorMessage={errors?.toAmount}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {dataFetched && currencyData ? (
              <>
                <div className="flex gap-2 items-center">
                  <span className="rounded-full border-3 border-amber-400 w-3 h-3" />
                  <p className="text-lg font-medium">
                    1 {currencyData.fromCurrency} ={" "}
                    {`${currencyData.exChangeRate} ${currencyData.toCurrency}`}
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
