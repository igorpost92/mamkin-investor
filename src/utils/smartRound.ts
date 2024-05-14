export const smartRound = (num: number, precision = 2) => {
  return parseFloat(num.toFixed(precision));
};
