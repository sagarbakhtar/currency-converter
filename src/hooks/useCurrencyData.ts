import { useEffect, useState, useCallback } from "react";

const CurrencyLimits: Record<string, number> = {
  PLN: 20000,
  EUR: 5000,
  GBP: 1000,
  UAH: 50000,
};

type ApiData = {
  from: string;
  to: string;
  rate: number;
  fromAmount: number;
  toAmount: number;
};

type ErrorResponse = {
  error: string;
  message?: string;
};

type UseCurrencyDataProps = {
  from: string;
  to: string;
  fromAmount: string;
  toAmount?: string;
  fetchDataOnLoad?: boolean;
};

const useCurrencyData = (props: UseCurrencyDataProps) => {
  const { from, to, fromAmount, toAmount, fetchDataOnLoad = true } = props;

  const [fetchData, setFetchData] = useState(fetchDataOnLoad);
  const [currencyDataFetched, setCurrencyDataFetched] = useState(false);
  const [apiData, setApiData] = useState<ApiData>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [loading, setLoading] = useState(false);

  const validateLimits = (
    errorKey: string,
    currency: string,
    amount: string
  ) => {
    if (
      !CurrencyLimits[currency] ||
      CurrencyLimits[currency] >= Number(amount)
    ) {
      setErrors({});
      return true;
    }
    setErrors({
      [errorKey]: `${currency} has limit of ${CurrencyLimits[currency]}`,
    });
    return false;
  };

  const fetchCurrencyData = useCallback(
    async (amount: string, calculationBase: string = "sendAmount") => {
      if (!fetchData) return;
      const errorKey =
        calculationBase === "sendAmount" ? "fromAmount" : "toAmount";
      const currencyToCheck = calculationBase === "sendAmount" ? from : to;
      if (!validateLimits(errorKey, currencyToCheck, amount)) return;

      setLoading(true);

      try {
        const response = await fetch(
          `https://my.transfergo.com/api/fx-rates?from=${from}&to=${to}&amount=${amount}&calculationBase=${calculationBase}`
        );

        if (response.ok) {
          const data: ApiData = await response.json();
          setApiData(data);
          setCurrencyDataFetched(true);
          setErrors({});
        } else {
          const errResponse: ErrorResponse = await response.json();
          const errorKey =
            calculationBase === "sendAmount" ? "fromAmount" : "toAmount";
          setErrors({ [errorKey]: errResponse.message || errResponse.error });
        }
      } catch {
        setErrors({ apiError: "Unable to process the request" });
      } finally {
        setLoading(false);
      }
    },
    [from, to, fetchData]
  );

  const convertCurrency = () => {
    if (!validateLimits("fromAmount", from, fromAmount)) return;
    setFetchData(true);
  };

  //Check if props value doesn't match with api data, then call api to get latest values
  useEffect(() => {
    if (
      from !== apiData?.from ||
      to !== apiData?.to ||
      apiData?.fromAmount !== Number(fromAmount)
    ) {
      fetchCurrencyData(fromAmount);
    } else if (toAmount && apiData?.toAmount !== Number(toAmount)) {
      fetchCurrencyData(toAmount, "receiveAmount");
    } else {
      setErrors({});
    }
  }, [fetchCurrencyData, fromAmount, toAmount]);

  return {
    loading,
    dataFetched: currencyDataFetched,
    apiData,
    errors,
    convertCurrency,
  };
};

export default useCurrencyData;
