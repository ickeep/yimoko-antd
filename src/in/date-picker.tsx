import { judgeIsEmpty, useAdditionalNode } from '@yimoko/store';
import { DatePicker as AntDatePicker, DatePickerProps as AntDatePickerProps } from 'antd';
import { RangePickerBaseProps, RangePickerDateProps, RangePickerTimeProps } from 'antd/lib/date-picker/generatePicker';
import dayjs, { Dayjs, OptionType } from 'dayjs';
import { forwardRef, useMemo } from 'react';

import { getAutoIcon } from '../base/icon';

export type DatePickerProps<T = string> = Omit<AntDatePickerProps, 'defaultValue' | 'value' | 'onChange'> & {
  value?: T
  defaultValue?: T
  onChange?: (value: T, day: Dayjs | null) => void
  // 时间值类型 字符串 秒 毫秒 dayjs
  dataValueType?: 'string' | 'second' | 'millisecond' | 'dayjs'
};

// 适配 schema  将 value 和 onChange 支持支持字符串和时间戳 默认类型为字符串
type Ref = React.ElementRef<typeof AntDatePicker>;

const DatePickerFC: <T = string>(props: DatePickerProps<T> & { ref?: React.Ref<Ref> }) => any = forwardRef<Ref, DatePickerProps<any>>((props, ref) => {
  const {
    defaultValue, value, onChange, dataValueType, format, picker,
    nextIcon, prevIcon, suffixIcon, superNextIcon, superPrevIcon,
    ...rest
  } = props;

  const curDefaultValue = valueToDayjs(defaultValue, dataValueType, format as OptionType, picker) as AntDatePickerProps['defaultValue'];

  const newProps = useMemo(() => {
    const obj: Pick<AntDatePickerProps, 'value' | 'onChange'> = {};
    if (value !== undefined) {
      obj.value = valueToDayjs(value, dataValueType, format as OptionType, picker);
    }
    if (onChange) {
      obj.onChange = (date, dateString) => {
        if (!date) {
          onChange(dateString, date);
        } else if (dataValueType === 'dayjs') {
          onChange(date, date);
        } else if (dataValueType === 'second') {
          onChange(date.unix(), date);
        } else if (dataValueType === 'millisecond') {
          onChange(date.valueOf(), date);
        } else {
          onChange(dateString, date);
        }
      };
    }

    return obj;
  }, [value, onChange, dataValueType, format, picker]);

  return (
    <AntDatePicker
      {...rest}
      ref={ref}
      defaultValue={curDefaultValue}
      format={format}
      picker={picker}
      nextIcon={getAutoIcon(nextIcon)}
      prevIcon={getAutoIcon(prevIcon)}
      suffixIcon={getAutoIcon(suffixIcon)}
      superNextIcon={getAutoIcon(superNextIcon)}
      superPrevIcon={getAutoIcon(superPrevIcon)}
      {...newProps}
    />
  );
});


// eslint-disable-next-line max-len
type AntRangePickerProps = Omit<RangePickerBaseProps<any>, 'defaultValue' | 'value' | 'onChange'> | Omit<RangePickerDateProps<any>, 'defaultValue' | 'value' | 'onChange'> | Omit<RangePickerTimeProps<any>, 'defaultValue' | 'value' | 'onChange'>;
export type RangePickerProps<T = string> = AntRangePickerProps & {
  value?: T[] | string // 两个日期支持 2000-01-01,2000-01-01 或者 [2000-01-01,2000-01-01]
  defaultValue?: T[] | string
  splitter?: string;
  valueType?: 'string' | 'array';
  onChange?: (value: T[] | string, day: (Dayjs | null)[] | null) => void
  // 时间值类型 字符串 秒 毫秒 dayjs
  dataValueType?: 'string' | 'second' | 'millisecond' | 'dayjs'
};


const RangePicker: <T = string>(props: RangePickerProps<T>) => any = (props: RangePickerProps<any>) => {
  const {
    defaultValue, valueType, value, splitter = ',', onChange, dataValueType, format, picker,
    nextIcon, prevIcon, suffixIcon, superNextIcon, superPrevIcon,
    separator,
    ...rest
  } = props;

  const curSeparator = useAdditionalNode('separator', separator);

  const curDefaultValue = valueToDayjsRange(defaultValue, splitter, dataValueType, format as OptionType, picker);

  const newProps = useMemo(() => {
    const obj: Pick<RangePickerBaseProps<any>, 'value' | 'onChange'> = {};
    if (value !== undefined) {
      obj.value = valueToDayjsRange(value, splitter, dataValueType, format as OptionType, picker);
    }
    if (onChange) {
      obj.onChange = (dates, dateStrings) => {
        let v: any[] = [];
        if (!dates) {
        } else if (dataValueType === 'dayjs') {
          v = dates;
        } else if (dataValueType === 'second') {
          v = dates.map(item => item?.unix() ?? '');
        } else if (dataValueType === 'millisecond') {
          v = dates.map(item => item?.valueOf() ?? '');
        } else {
          v = dateStrings;
        }
        onChange(valueType === 'string' ? v.join(splitter) : v, dates);
      };
    }
    return obj;
  }, [value, onChange, splitter, dataValueType, format, picker, valueType]);

  return (
    <AntDatePicker.RangePicker
      {...rest}
      defaultValue={curDefaultValue}
      format={format}
      picker={picker}
      nextIcon={getAutoIcon(nextIcon)}
      prevIcon={getAutoIcon(prevIcon)}
      suffixIcon={getAutoIcon(suffixIcon)}
      superNextIcon={getAutoIcon(superNextIcon)}
      superPrevIcon={getAutoIcon(superPrevIcon)}
      separator={curSeparator}
      {...newProps}
    />
  );
};

// eslint-disable-next-line complexity
const valueToDayjs = (value: DatePickerProps['value'], dataValueType: DatePickerProps['dataValueType'], format?: OptionType, picker?: DatePickerProps['picker']) => {
  if (value === undefined) {
    return value;
  }
  if (!value) {
    return null;
  }
  if (typeof value === 'object') {
    return value;
  } if (typeof value === 'number') {
    if (dataValueType === 'second') {
      return dayjs.unix(value);
    }
    return dayjs(value);
  }
  // 如果 format 为空 则根据 picker 自动推断
  let curFormat = format;
  if (!curFormat) {
    if (picker === 'week') {
      curFormat = 'YYYY-WW';
    } else if (picker === 'month') {
      curFormat = 'YYYY-MM';
    } else if (picker === 'quarter') {
      curFormat = 'YYYY-Q';
    } else if (picker === 'year') {
      curFormat = 'YYYY';
    } else if (picker === 'time') {
      curFormat = 'HH:mm:ss';
    }
  }
  return dayjs(value, curFormat);
};

const valueToDayjsRange = (
  value: RangePickerProps['value'],
  splitter = ',',
  dataValueType: RangePickerProps['dataValueType'],
  format?: OptionType,
  picker?: RangePickerProps['picker'],
) => {
  if (judgeIsEmpty(value)) {
    return undefined;
  }
  const arr: RangePickerBaseProps<any>['defaultValue'] = [null, null];
  const strArr = typeof value === 'string' ? value.split(splitter) : value;
  if (strArr.length > 0) {
    arr[0] = valueToDayjs(strArr[0], dataValueType, format as OptionType, picker) as Dayjs;
  }
  if (strArr.length > 1) {
    arr[1] = valueToDayjs(strArr[1], dataValueType, format as OptionType, picker) as Dayjs;
  }
  return arr;
};

export const DatePicker = Object.assign(DatePickerFC, {
  RangePicker,
  WeekPicker: AntDatePicker.WeekPicker,
  MonthPicker: AntDatePicker.MonthPicker,
  QuarterPicker: AntDatePicker.QuarterPicker,
  YearPicker: AntDatePicker.YearPicker,
  TimePicker: AntDatePicker.TimePicker,
});
