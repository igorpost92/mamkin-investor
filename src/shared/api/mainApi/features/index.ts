import { getDB } from '../../../db';
import { Feature, FeaturesConfig } from '../../../db/entities';

const getRepo = async () => {
  const db = await getDB();
  return db.getRepository(Feature);
};

export const getFeatures = async () => {
  const repo = await getRepo();
  const result = await repo.findOne({
    where: { enabled: true },
  });

  if (!result) {
    return;
  }

  const { enabled, ...config } = result;
  return config as FeaturesConfig;
};
