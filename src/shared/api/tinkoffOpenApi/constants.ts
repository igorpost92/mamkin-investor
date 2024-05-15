export const getCurrencyIsin = (currency: string) => {
  const mapping: Record<string, string | undefined> = {
    USD: 'USD000UTSTOM',
    KZT: 'KZTRUB_TOM',
  };

  const isin = mapping[currency];
  return isin;
};
