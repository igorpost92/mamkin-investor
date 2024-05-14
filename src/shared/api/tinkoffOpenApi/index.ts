import axios from 'axios';

const token = process.env.TINKOFF_TOKEN;

const baseUrl = 'https://invest-public-api.tinkoff.ru/rest/tinkoff.public.invest.api.contract.v1';

const getUrl = (resource: string) => `${baseUrl}.${resource}`;

class TinkoffOpenApi {
  instance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  getAccounts = async () => {
    const resourceUrl = getUrl('UsersService/GetAccounts');
    const response = await this.instance.post<GetAccountsResponse>(resourceUrl, {});
    return response.data.accounts;
  };

  getBonds = async () => {
    const resourceUrl = getUrl('InstrumentsService/Bonds');
    const response = await this.instance.post<{ instruments: Instrument[] }>(resourceUrl, {});
    return response.data.instruments;
  };

  getShares = async () => {
    const resourceUrl = getUrl('InstrumentsService/Shares');
    const response = await this.instance.post<{ instruments: Instrument[] }>(resourceUrl, {});
    return response.data.instruments;
  };

  getEtfs = async () => {
    const resourceUrl = getUrl('InstrumentsService/Etfs');
    const response = await this.instance.post<{ instruments: Instrument[] }>(resourceUrl, {});
    return response.data.instruments;
  };

  getCurrencies = async () => {
    const resourceUrl = getUrl('InstrumentsService/Currencies');
    const response = await this.instance.post<{ instruments: Instrument[] }>(resourceUrl, {});
    return response.data.instruments;
  };

  getMergedInstruments = async () => {
    const [bonds, shares, etfs, currencies] = await Promise.all([
      tinkoffOpenApi.getBonds(),
      tinkoffOpenApi.getShares(),
      tinkoffOpenApi.getEtfs(),
      tinkoffOpenApi.getCurrencies(),
    ]);

    const instruments = [
      ...bonds.map(instrument => ({ instrument, type: 'bond' })),
      ...shares.map(instrument => ({ instrument, type: 'share' })),
      ...etfs.map(instrument => ({ instrument, type: 'etf' })),
      ...currencies.map(instrument => ({ instrument, type: 'currency' })),
    ];

    return instruments as InstrumentWithType[];
  };

  getAssets = async () => {
    const resourceUrl = getUrl('InstrumentsService/GetAssets');
    const response = await this.instance.post<GetAssetsResponse>(resourceUrl, {});
    return response.data.assets;
  };

  getInstrument = async (id: string) => {
    const payload: GetInstrumentByRequest = {
      idType: 'INSTRUMENT_ID_TYPE_UID',
      id,
    };

    const resourceUrl = getUrl('InstrumentsService/GetInstrumentBy');
    const response = await this.instance.post<GetInstrumentByResponse>(resourceUrl, payload);
    const data = response.data.instrument;
    return data;
  };

  getOperationsListByAllAccounts = async () => {
    const accounts = await this.getAccounts();

    const data: OperationItem[] = [];

    for (const account of accounts) {
      const operations = await this.getOperationsList(account.id);
      data.push(...operations);
    }

    return data;
  };

  getOperationsList = async (accountId: string) => {
    const data: OperationItem[] = [];

    const iter = async (cursor?: string) => {
      const response = await this.getOperationsListCursor(accountId, cursor);

      data.push(...response.items);

      // TODO: not an iterative way!
      if (response.nextCursor) {
        await iter(response.nextCursor);
      }
    };

    await iter();

    return data;
  };

  getOperationsListCursor = async (accountId: string, cursor?: string) => {
    const resourceUrl = getUrl('OperationsService/GetOperationsByCursor');

    const params: GetOperationsByCursorRequest = {
      accountId,
      cursor,
      limit: 1000,
      state: 'OPERATION_STATE_EXECUTED',
    };

    const response = await this.instance.post<GetOperationsByCursorResponse>(resourceUrl, params);
    return response.data;
  };

  getClosePrices = async (uids: string[]) => {
    const resource = getUrl('MarketDataService/GetClosePrices');

    const instruments = uids.map(uid => ({
      instrumentId: uid,
    }));

    const response = await this.instance.post<GetClosePricesResponse>(resource, {
      instruments,
    });

    return response.data.closePrices;
  };
}

export const tinkoffOpenApi = new TinkoffOpenApi();

interface GetAccountsResponse {
  accounts: Account[];
}

// Информация о счёте.
interface Account {
  id: string; // Идентификатор счёта.
  name: string; // Название счёта.
  // status: AccountStatus // Статус счёта.
}

type InstrumentIdType =
  | 'INSTRUMENT_ID_UNSPECIFIED'
  | 'INSTRUMENT_ID_TYPE_FIGI'
  | 'INSTRUMENT_ID_TYPE_TICKER'
  | 'INSTRUMENT_ID_TYPE_UID'
  | 'INSTRUMENT_ID_TYPE_POSITION_UID';

type InstrumentTypeSimple = 'share' | 'bond' | 'etf' | 'currency';

interface GetInstrumentByRequest {
  idType: InstrumentIdType;
  id: string;
}

interface GetInstrumentByResponse {
  instrument: Instrument;
}

export interface Instrument {
  figi: string; // Figi-идентификатор инструмента.
  ticker: string; // Тикер инструмента.
  classCode: string; // Класс-код инструмента.
  isin: string; // Isin-идентификатор инструмента.
  currency: string; // Валюта расчётов.
  name: string; // Название инструмента.
  uid: string; // Уникальный идентификатор инструмента.
  assetUid: string; // Уникальный идентификатор актива.
}

export interface InstrumentWithType {
  instrument: Instrument;
  type: InstrumentTypeSimple;
}

interface GetAssetsResponse {
  assets: TinkoffAsset[];
}

// Информация об активе.
export interface TinkoffAsset {
  uid: string; //Уникальный идентификатор актива.
  name: string; // Наименование актива.
  instruments: Instrument[]; // Массив инструментов.
}

type StringTimestamp = string;
type int64 = string;
type int32 = number;

// Денежная сумма в определенной валюте
interface MoneyValue extends Quotation {
  currency: string; //Строковый ISO-код валюты
}

type OperationType = string;

type OperationState =
  | 'OPERATION_STATE_UNSPECIFIED'
  | 'OPERATION_STATE_EXECUTED'
  | 'OPERATION_STATE_CANCELED'
  | 'OPERATION_STATE_PROGRESS';

// Данные об операции.
interface OperationItem {
  brokerAccountId: string; // Номер счета клиента.
  id: string; // Идентификатор операции, может меняться с течением времени.
  parentOperationId: string; //Идентификатор родительской операции, может измениться, если изменился id родительской операции.
  name: string; // Название операции.
  date: StringTimestamp; // Дата поручения.
  type: OperationType; // Тип операции.
  state: OperationState; // Статус поручения.
  assetUid: string; // Идентификатор актива
  instrumentUid: string; // Уникальный идентификатор инструмента.
  instrumentType: InstrumentTypeSimple; //Тип инструмента.
  payment: MoneyValue; //Сумма операции.
  price: MoneyValue; //Цена операции за 1 инструмент.
  commission: MoneyValue; // Комиссия.
  accruedInt: MoneyValue; // Накопленный купонный доход.
  quantity: int64; //Количество единиц инструмента.
  quantityRest: int64; //Неисполненный остаток по сделке.
  quantityDone: int64; //Исполненный остаток.
}

// Запрос списка операций по счёту с пагинацией.
interface GetOperationsByCursorRequest {
  accountId: string; //Идентификатор счёта клиента. Обязательный параметр для данного метода, остальные параметры опциональны.
  from?: StringTimestamp; // Начало периода (по UTC).
  to?: StringTimestamp; // Окончание периода (по UTC).
  state?: OperationState; // Статус запрашиваемых операций.
  cursor?: string; // Идентификатор элемента, с которого начать формировать ответ.
  limit?: int32; //Лимит количества операций. По умолчанию устанавливается значение 100, максимальное значение 1000.
  withoutCommissions?: boolean; // Флаг возвращать ли комиссии, по умолчанию false
  withoutTrades?: boolean; // Флаг получения ответа без массива сделок.
  withoutOvernights?: boolean; // Флаг не показывать overnight операций.
}

// Список операций по счёту с пагинацией.
interface GetOperationsByCursorResponse {
  hasNext: boolean; // Признак, есть ли следующий элемент.
  nextCursor: string; // Следующий курсор.
  items: OperationItem[]; // Список операций.
}

interface GetClosePricesResponse {
  closePrices: InstrumentClosePrice[];
}

// Цена закрытия торговой сессии по инструменту.
interface InstrumentClosePrice {
  instrumentUid: string; // Uid инструмента.
  price?: Quotation; // Цена закрытия торговой сессии.
  eveningSessionPrice?: Quotation; // Цена последней сделки с вечерней сессии
  time?: StringTimestamp; // Дата совершения торгов.
}

// Котировка - денежная сумма без указания валюты
export interface Quotation {
  units: int64; // Целая часть суммы, может быть отрицательным числом
  nano: int32; // Дробная часть суммы, может быть отрицательным числом
}
