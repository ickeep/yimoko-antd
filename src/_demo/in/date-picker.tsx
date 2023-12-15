import { observer } from '@formily/react';
import { StorePage, useStore } from '@yimoko/store';
import { DatePicker as AntDatePicker } from 'antd';
import { useRef } from 'react';

import { Tabs, DatePicker, Divider, Space } from '@/library';

const { RangePicker } = DatePicker;

export const DatePickerDemo = () => (
  <div>
    <Tabs defaultActiveKey="JSX" items={[
      { key: 'JSX', label: 'JSX 调用', children: <DatePickerJSX /> },
      { key: 'schema', label: 'Schema', children: <DatePickerSchema /> },
    ]} />
  </div>
);

const DatePickerJSX = observer(() => {
  const store = useStore({
    defaultValues: {
      day: '', week: '', month: '', quarter: '', year: '', time: '', f1: '', f2: '', f3: '',
      rDay: [], rWeek: [], rMonth: [], rQuarter: [], rYear: [], rTime: [], rF1: [], rF2: [], rF3: [],
    },
  });
  const { setValues, values } = store;
  const {
    day, week, month, quarter, year, time, f1, f2, f3,
    rDay, rWeek, rMonth, rQuarter, rYear, rTime, rF1, rF2, rF3,
  } = values;
  const ref = useRef(null);
  const aRef = useRef(null);

  console.log(
    day, week, month, quarter, year, time, f1, f2, f3,
    rDay, rWeek, rMonth, rQuarter, rYear, rTime, rF1, rF2, rF3,
  );

  return <>
    <Divider orientation="left">ref</Divider>
    <Space>
      <DatePicker ref={ref} onChange={() => console.log(ref)} />
      <AntDatePicker ref={aRef} onChange={() => console.log(aRef)} />
    </Space>
    <Divider orientation="left">基本</Divider>
    <Space direction="vertical">
      <DatePicker onChange={console.log} defaultValue="2023-12-06" dataValueType='dayjs' />
      <DatePicker onChange={console.log} defaultValue={null} dataValueType="millisecond" picker="week" />
      <DatePicker onChange={console.log} defaultValue={''} dataValueType="second" picker="month" />
      <DatePicker onChange={console.log} defaultValue={undefined} dataValueType="string" picker="quarter" />
      <DatePicker onChange={console.log} picker="year" />
      <DatePicker onChange={console.log} picker="time" />
    </Space>

    <Divider orientation="left">受控</Divider>
    <Space direction="vertical">
      <DatePicker value={day} onChange={v => setValues({ day: v })} dataValueType='dayjs' />
      <DatePicker value={week} onChange={v => setValues({ week: v })} dataValueType="millisecond" picker="week" />
      <DatePicker value={month} onChange={v => setValues({ month: v })} dataValueType="second" picker="month" />
      <DatePicker value={quarter} onChange={v => setValues({ quarter: v })} dataValueType="string" picker="quarter" />
      <DatePicker value={year} onChange={v => setValues({ year: v })} picker="year" />
      <DatePicker value={time} onChange={v => setValues({ time: v })} picker="time" />
    </Space>
    <Divider orientation="left">format</Divider>

    <Space direction="vertical">
      <DatePicker onChange={console.log} format="YYYY/MM/DD" />
      <DatePicker onChange={console.log} dataValueType="millisecond" format="MM/DD" />
      <DatePicker onChange={console.log} dataValueType="second" format="YYYY/MM" />

      <DatePicker format="YYYY/MM/DD" value={f1} onChange={v => setValues({ f1: v })} />
      <DatePicker format="MM/DD" value={f2} onChange={v => setValues({ f2: v })} />
      <DatePicker format="YYYY/MM" value={f3} onChange={v => setValues({ f3: v })} />
    </Space>

    <Divider orientation="left">范围选择器</Divider>
    <Space direction="vertical" size={12}>
      <RangePicker onChange={console.log} />
      <RangePicker onChange={console.log} showTime />
      <RangePicker onChange={console.log} picker="week" />
      <RangePicker onChange={console.log} picker="month" />
      <RangePicker onChange={console.log} picker="quarter" />
      <RangePicker onChange={console.log} picker="year" />
    </Space>

    <Divider orientation="left">范围选择器受控</Divider>
    <Space direction="vertical" size={12}>
      <RangePicker value={rDay} onChange={(v: any) => setValues({ rDay: v })} />
      <RangePicker value={rWeek} onChange={(v: any) => setValues({ rWeek: v })} showTime />
      <RangePicker value={rMonth} onChange={(v: any) => setValues({ rMonth: v })} picker="month" />
      <RangePicker value={rQuarter} onChange={(v: any) => setValues({ rQuarter: v })} picker="quarter" />
      <RangePicker value={rYear} onChange={(v: any) => setValues({ rYear: v })} picker="year" />
      <RangePicker value={rTime} onChange={(v: any) => setValues({ rTime: v })} picker="time" />
    </Space>
  </>;
});

const DatePickerSchema = () => (
  <StorePage
    store={{ defaultValues: { c: true, group: [] } }}
    components={{ DatePicker }}
    schema={{
      type: 'object',

    }}
  />
);
