import { parseFinam } from './parseData';
import { saveOperations } from './saveData';
import { getBrokerSyncDate } from '../../utils/getBrokerSyncDate';
import { brokers } from '../../../../shared/constants';

export const importFromFinam = async (content: Buffer) => {
  try {
    let operations = await parseFinam(content);

    const syncDate = await getBrokerSyncDate(brokers.finam);

    if (syncDate) {
      operations = operations.filter(item => item.date > syncDate);
    }

    if (!operations.length) {
      console.log('no data');
      return;
    }

    await saveOperations(operations);
  } catch (e) {
    console.error('error');
    throw e;
  }
};
