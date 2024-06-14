import React from 'react';
import SellsStats from './SellsStats';
import { getSellsStatsData } from './getData';

// TODO: type
// export interface Datum {
// }

const SellsStatsPage: React.FC = async () => {
  const data = await getSellsStatsData();

  return <SellsStats data={data} />;
};

export default SellsStatsPage;
