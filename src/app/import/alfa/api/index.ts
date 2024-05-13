import { parseData } from './parseData';
import { saveData } from './saveData';
import { getBrokerSyncDate } from '../../utils/getBrokerSyncDate';
import { brokers } from '../../../../shared/constants';

export const importFromAlfa = async (content: Buffer) => {
  try {
    let operations = await parseData(content);

    const syncDate = await getBrokerSyncDate(brokers.alfa);

    if (syncDate) {
      operations = operations.filter(item => item.date > syncDate);
    }

    if (!operations.length) {
      console.log('no data');
      return;
    }

    await saveData(operations);
  } catch (e) {
    console.error('error');
    throw e;
  }
};
