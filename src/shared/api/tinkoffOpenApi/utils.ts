import { Quotation } from './index';

export const parseTinkoffNumber = (value: Quotation) => {
  // TODO: big js

  const num = `${value.units}.${value.nano}`;
  return num.replaceAll('-', '');
};
