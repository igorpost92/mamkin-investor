import { parseData } from './parseData';
import { saveData } from './saveData';
import { getBrokerSyncDate } from '../../utils/getBrokerSyncDate';
import { brokers } from '../../../../shared/constants';

export const importFromFreedom = async (content: string) => {
  try {
    console.log('import from freedom');
    let operations = await parseData(content);

    const syncDate = await getBrokerSyncDate(brokers.freedom);

    if (syncDate) {
      operations = operations.filter(item => item.date > syncDate);
    }

    if (!operations.length) {
      console.log('no data');
      return;
    }

    await saveData(operations);

    // TODO: show result
  } catch (e) {
    console.error('error');
    throw e;
  }
};
