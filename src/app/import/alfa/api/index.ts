import { parseData } from './parseData';
import { saveData } from './saveData';

export const importFromAlfa = async (content: Buffer) => {
  try {
    const operations = await parseData(content);

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
