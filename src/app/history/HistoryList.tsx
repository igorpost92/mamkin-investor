'use client';

import React, { Fragment } from 'react';
import { format, isSameDay } from 'date-fns';
import styles from './HistoryList.module.css';
import { Deposit, Dividend, Purchase, Sell, Transfer, Withdrawal } from '../../shared/db/entities';
import { NumberFormatter } from '@mantine/core';

// TODO: little refacto
// TODO: filters
// TODO: portions

interface Props {
  data: {
    operationType: 'transfer' | 'deposit' | 'purchase' | 'dividend' | 'sell' | 'withdrawal';
    date: Date;
    // todo  any
    document: any;
  }[];
}

// TODO: precision

const CashData: React.FC<{
  type: 'deposit' | 'withdrawal';
  data: Deposit | Withdrawal;
}> = ({ data, type }) => {
  const operationType = type === 'deposit' ? 'Deposit' : 'Withdrawal';

  return (
    <>
      <div className={styles.content}>
        <div>{operationType}</div>
        <div>{data.broker.name}</div>
      </div>
      <div className={styles.extra}>
        <div>
          <NumberFormatter value={data.sum} thousandSeparator={' '} />
          &nbsp;
          {data.currency}
        </div>
      </div>
    </>
  );
};

const TradeData: React.FC<{
  type: 'purchase' | 'sell';
  data: Purchase | Sell;
}> = ({ data, type }) => {
  const operationType = type === 'purchase' ? 'Purchase' : 'Sell';

  return (
    <>
      <div className={styles.content}>
        <div>{operationType}</div>
        <div>{data.broker.name}</div>
        <div>
          {data.asset.name} ({data.asset.ticker})
        </div>
      </div>
      <div className={styles.extra}>
        <div>
          <NumberFormatter value={data.sum} thousandSeparator={' '} />
          &nbsp;
          {data.currency}
        </div>
        <div>
          <NumberFormatter value={data.quantity} thousandSeparator={' '} />
          &nbsp; * &nbsp;
          <NumberFormatter value={data.price} thousandSeparator={' '} />
        </div>
      </div>
    </>
  );
};

const DividendData: React.FC<{ data: Dividend }> = ({ data }) => {
  return (
    <>
      <div className={styles.content}>
        <div>Dividend</div>
        <div>{data.broker.name}</div>
        <div>
          {data.asset.name} ({data.asset.ticker})
        </div>
      </div>
      <div className={styles.extra}>
        <div>
          <NumberFormatter value={data.sum} thousandSeparator={' '} />
          &nbsp;
          {data.currency}
        </div>
      </div>
    </>
  );
};

const TransferData: React.FC<{ data: Transfer }> = ({ data }) => {
  return (
    <>
      <div className={styles.content}>
        <div>Transfer</div>
        <div>
          {/* TODO: icon */}
          {data.brokerFrom.name} -&gt; {data.brokerTo.name}
        </div>
        <div>
          {data.asset.name} ({data.asset.ticker})
        </div>
      </div>
      <div className={styles.extra}>
        <div>
          <NumberFormatter value={data.quantity} thousandSeparator={' '} />
        </div>
      </div>
    </>
  );
};

const HistoryList: React.FC<Props> = props => {
  // TODO: default value
  let lastDate = new Date('1990/01/01');

  return (
    <div>
      {props.data.map((item, idx) => {
        let cardData;
        if (item.operationType === 'deposit' || item.operationType === 'withdrawal') {
          cardData = <CashData data={item.document} type={item.operationType} />;
        } else if (item.operationType === 'purchase' || item.operationType === 'sell') {
          cardData = <TradeData data={item.document} type={item.operationType} />;
        } else if (item.operationType === 'dividend') {
          cardData = <DividendData data={item.document} />;
        } else if (item.operationType === 'transfer') {
          cardData = <TransferData data={item.document} />;
        }

        if (!cardData) {
          return null;
        }

        let dayElement;

        if (!isSameDay(item.date, lastDate)) {
          lastDate = item.date;
          dayElement = <div className={styles.daySection}>{format(item.date, 'dd MMM yyyy')}</div>;
        }

        return (
          <Fragment key={idx}>
            {dayElement}
            <div className={styles.card}>
              <div className={styles.time}>{format(item.date, 'HH:mm')}</div>
              {cardData}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export default HistoryList;
