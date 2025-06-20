import { useEffect, useState } from "react";

type CurrencyData = {
  from: string;
  to: string;
  rate: number;
  fromAmount: number;
  toAmount: number;
};

type UseCurrencyDataProps = {
  defaultFrom: string;
  defaultTo: string;
  defaultAmount: string;
};
const useCurrencyData = ({
  defaultFrom,
  defaultTo,
  defaultAmount,
}: UseCurrencyDataProps) => {
  const [fromCurrency, setFromCurrency] = useState(defaultFrom);
  const [toCurrency, setToCurrency] = useState(defaultTo);
  const [fromAmount, setFromAmount] = useState(defaultAmount);
  const [toAmount, setToAmount] = useState<string | null>(null);
  const [rate, setRate] = useState<number | null>(null);

  const [currencyDataFetched, setCurrencyDataFetched] = useState(false);
  const [currencyData, setCurrencyData] = useState<CurrencyData>();

  const [loading, setLoading] = useState(false);

  const fetchCurrencyData = async (calculationBase: string = "sendAmount") => {
    setLoading(true);

    const amount = calculationBase === "sendAmount" ? fromAmount : toAmount;
    try {
      const response = await fetch(
        `https://my.transfergo.com/api/fx-rates?from=${fromCurrency}&to=${toCurrency}&amount=${amount}&calculationBase=${calculationBase}`
      );
      const data: CurrencyData = await response.json();
      if (response.ok) {
        setCurrencyData(data);
        setFromAmount(data.fromAmount.toString());
        setToAmount(data.toAmount.toString());
        setRate(data.rate);
        setCurrencyDataFetched(true);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const interChangeCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    if (currencyDataFetched) {
      convertCurrency();
    }
  };
  const convertCurrency = (calculationBase?: string) => {
    fetchCurrencyData(calculationBase);
  };
  const resetCurrencyData = () => {
    setCurrencyDataFetched(false);
    setRate(null);
    setToAmount(null);
  };

  useEffect(() => {
    if (
      currencyDataFetched &&
      currencyData?.fromAmount.toString() !== fromAmount
    ) {
      convertCurrency();
    }
  }, [fromAmount]);

  useEffect(() => {
    if (currencyDataFetched && currencyData?.toAmount.toString() !== toAmount) {
      convertCurrency("receiveAmount");
    }
  }, [toAmount]);

  return {
    loading,
    dataFetched: currencyDataFetched,
    currencyData: {
      fromCurrency,
      toCurrency,
      fromAmount,
      toAmount,
      rate,
    },
    setFromCurrency,
    setToCurrency,
    setFromAmount,
    setToAmount,
    convertCurrency,
    resetCurrencyData,
    interChangeCurrencies,
  };
};

export default useCurrencyData;
