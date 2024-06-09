import React from 'react';
import HistoryList from './HistoryList';
import { getHistory } from './getHistory';

const History: React.FC = async () => {
  const data = await getHistory();

  return <HistoryList data={data} />;
};

export default History;
