'use server';

import { getOperations } from './getOperations';
import { saveOperations } from './saveOperations';
import { getBrokerSyncDate } from '../../../utils/getBrokerSyncDate';
import { brokers } from '../../../../../shared/constants';
import { revalidateAll } from '../../../utils/revalidateAll';

export const syncOperations = async () => {
  try {
    console.log('import from tinkoff');
    let operations = await getOperations();

    const syncDate = await getBrokerSyncDate(brokers.tinkoff);

    if (syncDate) {
      operations = operations.filter(item => item.date > syncDate);
    }

    if (!operations.length) {
      console.log('no data');
      return;
    }

    await saveOperations(operations);
    revalidateAll();

    // TODO: show result on front
  } catch (e) {
    console.error('error');
    throw e;
  }
};
