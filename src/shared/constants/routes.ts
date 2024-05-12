import { QueryParams } from './queryParams';

export const appRoutes = {
  assets: '/assets',
  asset: (id: string) => `${appRoutes.assets}/${id}`,
  newAsset: () => `${appRoutes.assets}/new`,

  brokers: '/brokers',
  broker: (id: string) => `${appRoutes.brokers}/${id}`,
  newBroker: () => `${appRoutes.brokers}/new`,

  deposits: '/deposits',
  deposit: (id: string) => `${appRoutes.deposits}/${id}`,
  newDeposit: () => `${appRoutes.deposits}/new`,

  purchases: '/purchases',
  purchase: (id: string) => `${appRoutes.purchases}/${id}`,
  newPurchase: () => `${appRoutes.purchases}/new`,

  dividends: '/dividends',
  dividend: (id: string) => `${appRoutes.dividends}/${id}`,
  newDividend: () => `${appRoutes.dividends}/new`,

  sells: '/sells',
  sell: (id: string) => `${appRoutes.sells}/${id}`,
  newSell: () => `${appRoutes.sells}/new`,

  withdrawals: '/withdrawals',
  withdrawal: (id: string) => `${appRoutes.withdrawals}/${id}`,
  newWithdrawal: () => `${appRoutes.withdrawals}/new`,

  splits: '/splits',
  split: (id: string) => `${appRoutes.splits}/${id}`,
  newSplit: () => `${appRoutes.splits}/new`,

  tradingJournal: '/trading-journal',
  import: '/import',
  portfolio: '/portfolio',
};

export const routeWithRedirect = (url: string, from: string) => {
  // TODO: refacto
  const encodedFrom = encodeURIComponent(from);
  return `${url}?${QueryParams.From}=${encodedFrom}`;
};
