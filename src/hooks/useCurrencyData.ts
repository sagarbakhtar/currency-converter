import { useEffect, useState } from "react";
import useDebounceEffect from "./useDebounceEffect";

type CurrencyData = {
  from: string;
  to: string;
  rate: number;
  fromAmount: number;
  toAmount: number;
};

type ErrorResponse = {
  error: string
  message?: string
}

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
  const [toAmount, setToAmount] = useState<string>("");
  const [exChangeRate, setExchangeRate] = useState<number | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({})

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
                  
        
      if (response.ok) {
        const data: CurrencyData = await response.json();
        setCurrencyData(data);
        setFromAmount(data.fromAmount.toString());
        setToAmount(data.toAmount.toString());
        setExchangeRate(data.rate);
        setCurrencyDataFetched(true);
        setErrors({})
      } else {
        const errResponse: ErrorResponse = await response.json();
        const errorKey = calculationBase === "sendAmount" ? 'fromAmount' : 'toAmount'
        setErrors({ [errorKey]: errResponse.message || errResponse.error})
      }
    } catch {      
      setErrors({ apiError: 'Unable to process the request'})
    } finally {
      setLoading(false);
    }
  };

  const interChangeCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const convertCurrency = (calculationBase?: string) => {
    fetchCurrencyData(calculationBase);
  };

  const resetCurrencyData = () => {
    setCurrencyDataFetched(false);
    setExchangeRate(null);
    setToAmount("");
  };

  useEffect(() => {
    if (currencyDataFetched) {
      fetchCurrencyData();
    }
  }, [fromCurrency, toCurrency]);

  useDebounceEffect(
    () => {
      if (
        currencyDataFetched &&
        currencyData?.fromAmount.toString() !== fromAmount
      ) {
        convertCurrency();
      }
    },
    [fromAmount],
    500
  );

  useDebounceEffect(
    () => {
      if (
        currencyDataFetched &&
        currencyData?.toAmount.toString() !== toAmount
      ) {
        convertCurrency("receiveAmount");
      }
    },
    [toAmount],
    500
  );

  return {
    loading,
    dataFetched: currencyDataFetched,
    currencyData: {
      fromCurrency,
      toCurrency,
      fromAmount,
      toAmount,
      exChangeRate,
    },
    setFromCurrency,
    setToCurrency,
    setFromAmount,
    setToAmount,
    convertCurrency,
    resetCurrencyData,
    interChangeCurrencies,
    errors
  };
};

export default useCurrencyData;
