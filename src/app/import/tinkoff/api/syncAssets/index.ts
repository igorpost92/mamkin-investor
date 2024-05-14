'use server';

import { IsNull } from 'typeorm';
import { getAssetsToSync } from './getAssetsToSync';
import { getDB } from '../../../../../shared/db';
import { Asset } from '../../../../../shared/db/entities';

export const syncAssets = async () => {
  const db = await getDB();
  const repo = db.getRepository(Asset);

  const data = await repo.find({
    where: [
      //
      { instrumentUid: '' },
      { instrumentUid: IsNull() },
      { uid: '' },
      { uid: IsNull() },
    ],
  });

  if (!data.length) {
    console.log('no assets to sync');
    return;
  }

  const result = await getAssetsToSync(data);

  await db.transaction(async tx => {
    const repo = tx.getRepository(Asset);

    for (const item of result) {
      await repo.update(item.asset.id, {
        uid: item.uid,
        instrumentUid: item.instrumentUid,
        ticker: item.ticker,
        type: item.type,
      });
    }
  });

  console.log('synced:', result);
  return result.length;
};
