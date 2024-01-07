import { observer } from '@formily/react';
import { useAPIOptions, useAPISearchOptions, strToArr, IOptionsAPISearchProps } from '@yimoko/store';
import { Select as AntSelect, Spin, SelectProps as TSelectProps } from 'antd';
import React, { useMemo, useState } from 'react';

export type SelectProps = TSelectProps & IOptionsAPISearchProps;

// TODO:  test
export const Select = observer((props: SelectProps) => {
  const { splitter, keys, options, api, labelAPI, apiType, searchConfig, value, valueType, mode, onChange, ...args } = props;
  const [searchVal, setSearchVal] = useState('');

  const [data, loading] = apiType === 'search'
    ? useAPISearchOptions(searchVal, value, options, api, labelAPI, searchConfig, keys, splitter)
    : useAPIOptions(options, api, keys, splitter);

  // todo 搜索时 支持 label 并且不分大小写
  const searchProps = useMemo(() => (apiType !== 'search'
    ? {}
    : {
      showSearch: true,
      filterOption: false,
      searchValue: searchVal,
      onSearch: setSearchVal,
      notFoundContent: loading ? <Spin size='small' /> : null,
    }
  ), [apiType, loading, searchVal]);

  const curValue = useMemo(() => {
    if (mode && ['multiple', 'tags'].includes(mode) && typeof value === 'string') {
      return strToArr(value, splitter);
    }
    return value;
  }, [mode, splitter, value]);

  const newProps: SelectProps = { ...args };
  if (curValue !== undefined) {
    newProps.value = curValue;
  }

  return (
    <AntSelect<any, any>
      allowClear={!loading}
      loading={loading}
      options={data}
      {...searchProps}
      {...args}
      {...newProps}
      mode={mode}
      onChange={(val, options) => {
        onChange?.(valueType === 'string' && Array.isArray(val) ? val.join(splitter) : val, options);
      }}
    />
  );
});

