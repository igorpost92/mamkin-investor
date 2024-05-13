import xml2js from 'xml2js';
import iconv from 'iconv-lite';
import { parseVersion3 } from './version3';

const readFile = async (fileData: Buffer) => {
  const encodings = ['cp1251', 'utf16le'];

  for (const encoding of encodings) {
    try {
      const body = iconv.decode(fileData, encoding).toString();
      if (!body.startsWith('<?xml version="1.0"')) {
        throw new Error();
      }

      return body;
    } catch (e) {
      console.error(`Can't read in ${encoding}`);
    }
  }

  throw new Error("Can't read file. Unknown encoding");
};

export const parseFinam = async (content: Buffer) => {
  const parser = new xml2js.Parser();

  const fileData = await readFile(content);
  const dataObject: any = await parser.parseStringPromise(fileData);
  const version = dataObject.REPORT_DOC.DOC_REQUISITES[0].TEMPLATE[0].$.Name;

  if (version === 'report03' || version === 'report04' || version === 'report05') {
    const result = parseVersion3(dataObject);
    return result;
  } else {
    throw new Error(`unknown version ${version}`);
  }
};
