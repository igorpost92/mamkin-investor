import React from 'react';
import TradingJournalTable from './ui/TradingJournalTable';
import { getData } from './api/getData';

const TradingJournal: React.FC = async () => {
  const data = await getData();

  return <TradingJournalTable data={data} />;
};

export default TradingJournal;
