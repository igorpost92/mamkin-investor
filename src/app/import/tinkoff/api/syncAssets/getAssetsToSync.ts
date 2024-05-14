import { tinkoffOpenApi } from '../../../../../shared/api/tinkoffOpenApi';
import { Asset } from '../../../../../shared/db/entities';

export const getAssetsToSync = async (data: Asset[]) => {
  // TODO: refacto, or maybe join with method in syncOps

  const instruments = await tinkoffOpenApi.getMergedInstruments();

  const result = data.map(asset => {
    let instrumentWithType;

    const possibleMatches = instruments.filter(item => item.instrument.isin === asset.isin);

    if (!possibleMatches.length) {
      console.log(`not found for ${asset.name}`);
      return;
    }

    if (possibleMatches.length > 1) {
      const matchesByCurrency = possibleMatches.filter(
        item => item.instrument.currency.toUpperCase() === asset.currency,
      );

      if (matchesByCurrency.length === 1) {
        [instrumentWithType] = matchesByCurrency;
      } else {
        console.log(`not found for ${asset.name}. matches: `, possibleMatches);
        return;
      }
    } else {
      [instrumentWithType] = possibleMatches;
    }

    if (instrumentWithType.instrument.currency.toUpperCase() !== asset.currency) {
      console.log(`currency is not the same for ${asset.name}`);
      return;
    }

    const { type } = instrumentWithType;

    return {
      asset,
      instrument: instrumentWithType.instrument,
      type,
    };
  });

  const values = result.filter(Boolean).map(_item => {
    // TODO: refacto type guards
    const item = _item!;
    const { instrument } = item;

    return {
      asset: item.asset,
      name: item.asset.name,
      type: item.type,
      ticker: instrument.ticker,
      currency: instrument.currency,
      uid: instrument.assetUid,
      instrumentUid: instrument.uid,
    };
  });

  return values;
};
