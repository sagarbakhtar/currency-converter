import fetchMock from "jest-fetch-mock";
import useConvertCurrency from "@/hooks/useConvertCurrency";
import { act, renderHook, waitFor } from "@testing-library/react";

fetchMock.enableMocks();

describe("useConvertCurrency hook", () => {
  const mockResponse = {
    from: "EUR",
    to: "GBP",
    fromAmount: 1,
    toAmount: 0.84,
    rate: 0.8434,
  };

  beforeEach(() => {
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });
  });

  afterEach(() => {
    fetchMock.resetMocks(); // Reset mocks before each test
  });

  test("should fetch data on initial load", async () => {
    const { result } = renderHook(() =>
      useConvertCurrency({ from: "EUR", to: "GBP", fromAmount: "1.00" })
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "https://my.transfergo.com/api/fx-rates?from=EUR&to=GBP&amount=1.00&calculationBase=sendAmount"
      );
      expect(result.current.apiData).toEqual(mockResponse);
    });
  });

  test("should fetch data only after convert currency function call", async () => {
    const { result } = renderHook(() =>
      useConvertCurrency({
        from: "EUR",
        to: "GBP",
        fromAmount: "1.00",
        fetchDataOnLoad: false,
      })
    );

    expect(fetchMock).not.toHaveBeenCalled();
    act(() => result.current.convertCurrency());

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "https://my.transfergo.com/api/fx-rates?from=EUR&to=GBP&amount=1.00&calculationBase=sendAmount"
      );
      expect(result.current.apiData).toEqual(mockResponse);
    });
  });

  test("should re-fetch data on amount change", async () => {
    const { rerender } = renderHook(
      ({ from, to, fromAmount }) =>
        useConvertCurrency({ from, to, fromAmount }),
      {
        initialProps: { from: "EUR", to: "GBP", fromAmount: "1.00" },
      }
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "https://my.transfergo.com/api/fx-rates?from=EUR&to=GBP&amount=1.00&calculationBase=sendAmount"
      );
    });

    act(() => {
      rerender({ from: "EUR", to: "GBP", fromAmount: "2.00" });
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "https://my.transfergo.com/api/fx-rates?from=EUR&to=GBP&amount=2.00&calculationBase=sendAmount"
      );
    });
  });

  test("should re-fetch data with calculation base as receiveAmount for to amount change", async () => {
    const { rerender } = renderHook(
      ({ from, to, fromAmount, toAmount }) =>
        useConvertCurrency({ from, to, fromAmount, toAmount }),
      {
        initialProps: { from: "EUR", to: "GBP", fromAmount: "1.00", toAmount: '0.8' },
      }
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    act(() => {
      rerender({ from: "EUR", to: "GBP", fromAmount: "1.00", toAmount: '1.8' });
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "https://my.transfergo.com/api/fx-rates?from=EUR&to=GBP&amount=1.8&calculationBase=receiveAmount"
      );
    });
  });
});
