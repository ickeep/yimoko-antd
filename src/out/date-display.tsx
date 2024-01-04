import dayjs from 'dayjs';
import React from 'react';
export interface DateDisplayProps {
  date?: string | number | Date;
  value?: string | number | Date;
  timestamp?: 'ms' | 's',
  format?: string,
  valFormat?: string,
}
const dfFormat = 'YYYY-MM-DD HH:mm:ss';
// eslint-disable-next-line complexity
export const DateDisplay = (props: DateDisplayProps) => {
  const { date, value, timestamp = 's', format = dfFormat, valFormat = dfFormat } = props;
  const dateVal = date ?? value;
  if (!dateVal) {
    return null;
  }
  // 如果是一个Date
  if (dateVal instanceof Date) {
    return <>{dayjs(dateVal).format(format)}</>;
  }
  // 如果是一个 数字
  if (typeof dateVal === 'number') {
    return <>{dayjs(timestamp === 's' ? dateVal * 1000 : dateVal).format(format)}</>;
  }
  // 如果是一个数字字符串
  if (typeof dateVal === 'string' && /^\d+$/.test(dateVal)) {
    return <>{dayjs(timestamp === 's' ? Number(dateVal) * 1000 : Number(dateVal)).format(format)}</>;
  }
  return <>{dayjs(dateVal, valFormat).format(format)}</>;
};
