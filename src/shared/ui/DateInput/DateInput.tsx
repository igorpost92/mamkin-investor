import React from 'react';
import { DateInput as DateInputLib, DateInputProps } from '@mantine/dates';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// TODO: move some place else?

// It is required to extend dayjs with customParseFormat plugin
// in order to parse dates with custom format
dayjs.extend(customParseFormat);

type LibProps = Pick<DateInputProps, 'value' | 'onChange' | 'onFocus' | 'onBlur'>;

interface Props extends LibProps {
  id?: string;
  name?: string;
  dateFormat?: DateFormat;
}

type DateFormat = 'date' | 'datetime';

const getFormatStr = (dateFormat: DateFormat) => {
  const template = dateFormat === 'date' ? 'DD.MM.YYYY' : 'DD.MM.YYYY HH:mm:ss';
  return template;
};

// TODO: ref, blur, focus

export const DateInput: React.FC<Props> = props => {
  const { dateFormat = 'date', ...restProps } = props;

  return (
    <DateInputLib
      {...restProps}
      // todo
      // dateParser
      valueFormat={getFormatStr(dateFormat)}
      // todo
      // rightSection
    />
  );
};
