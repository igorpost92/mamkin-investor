import { getComplexData } from '../getComplexData';
import { getDB } from '../../../shared/db';
import { Asset } from '../../../shared/db/entities';
import { instanceToPlain } from 'class-transformer';

export const getSellsStatsData = async () => {
  const { moves } = await getComplexData();

  const db = await getDB();
  const assets = await db.getRepository(Asset).find();

  const sells = moves
    .filter(item => item.type === 'sell')
    .map(item => {
      const { assetId, ...restData } = item;

      const asset = instanceToPlain(assets.find(a => a.id === assetId)) as Asset;

      const quantity = Math.abs(item.quantity);

      const { buyPrice, sellPrice } = item;

      if (!sellPrice || !buyPrice) {
        return {
          ...restData,
          asset,
          quantity,
        };
      }

      const priceDelta = sellPrice - buyPrice;
      const delta = priceDelta * quantity;

      return {
        ...restData,
        asset,
        quantity,
        delta,
      };
    });

  return sells;
};
