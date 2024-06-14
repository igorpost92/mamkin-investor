import { getComplexData } from '../getComplexData';
import { getDB } from '../../../shared/db';
import { Asset, Broker } from '../../../shared/db/entities';
import { instanceToPlain } from 'class-transformer';

export const getSellsStatsData = async () => {
  const { moves } = await getComplexData();

  const db = await getDB();
  const assets = await db.getRepository(Asset).find();
  const brokers = await db.getRepository(Broker).find();

  const sells = moves
    .filter(item => item.type === 'sell')
    .map(item => {
      const { assetId, brokerId, ...restData } = item;

      const asset = instanceToPlain(assets.find(a => a.id === assetId)) as Asset;
      const broker = instanceToPlain(brokers.find(b => b.id === brokerId)) as Broker;

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
        broker,
        quantity,
        delta,
      };
    });

  return sells;
};
