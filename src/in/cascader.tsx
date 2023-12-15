import { observer } from '@formily/react';
import { IKeys, IOptionsAPIProps, strToArr, useAPIOptions, useAdditionalNode } from '@yimoko/store';
import { Cascader as AntCascader, CascaderProps } from 'antd';

import { BaseOptionType } from 'antd/lib/cascader';
import { CascaderPanelProps } from 'antd/lib/cascader/Panel';
import { FC, ReactNode, useMemo } from 'react';

import { getAutoIcon } from '../base/icon';

type ValueType = string | number | (string | number)[];

type ICascaderProps<DataNodeType extends BaseOptionType = any> = Omit<CascaderProps<DataNodeType>, 'onChange'> & IOptionsAPIProps & {
  onChange?: (value: ValueType, selectedOptions?: any[]) => void
};

const CascaderFC: <DataNodeType extends BaseOptionType = any>(props: ICascaderProps<DataNodeType>) => ReactNode = observer((props: ICascaderProps) => {
  const {
    options, api, fieldNames, keys, splitter,
    expandIcon, suffixIcon, removeIcon, allowClear,
    placeholder,
    maxTagPlaceholder,
    valueType, value, onChange,
    ...rest
  } = props;
  // @ts-ignore
  const curMaxTagPlaceholder = useAdditionalNode('maxTagPlaceholder', maxTagPlaceholder);
  const curPlaceholder = useAdditionalNode('placeholder', placeholder);

  const curKeys = (fieldNames ?? keys) as IKeys;

  const [data] = useAPIOptions<any>(options, api, curKeys, splitter);

  const curAllowClear = useMemo(() => {
    if (typeof allowClear === 'object' && allowClear.clearIcon) {
      return {
        ...allowClear,
        clearIcon: getAutoIcon(allowClear.clearIcon),
      };
    }
    return allowClear;
  }, [allowClear]);

  const curValue = useMemo(() => {
    if (rest.multiple && typeof value === 'string') {
      return strToArr(value, splitter);
    }
    return value;
  }, [rest.multiple, splitter, value]);

  const newProps: CascaderProps = { ...rest };
  if (curValue !== undefined) {
    newProps.value = curValue;
  }

  return (
    <AntCascader
      {...rest}
      fieldNames={curKeys}
      options={data}
      allowClear={curAllowClear}
      expandIcon={getAutoIcon(expandIcon)}
      suffixIcon={getAutoIcon(suffixIcon)}
      removeIcon={getAutoIcon(removeIcon)}
      placeholder={curPlaceholder}
      maxTagPlaceholder={curMaxTagPlaceholder}
      onChange={(val: any, ...rest) => {
        onChange?.(valueType === 'string' && Array.isArray(val) ? val.join(splitter) : val, ...rest);
      }
      }
    />
  );
});

type ICascaderPanelFC = FC<Omit<CascaderPanelProps, 'onChange'> & IOptionsAPIProps & {
  onChange?: (value: ValueType, selectedOptions?: any[]) => void
}>;

const Panel: ICascaderPanelFC = observer((props) => {
  const {
    options, api, fieldNames, keys, splitter,
    expandIcon,
    valueType, value, onChange,
    ...rest
  } = props;

  const curKeys = (fieldNames ?? keys) as IKeys;

  const [data] = useAPIOptions<any>(options, api, curKeys, splitter);

  const curValue = useMemo(() => {
    if (rest.multiple && typeof value === 'string') {
      return strToArr(value, splitter);
    }
    return value;
  }, [rest.multiple, splitter, value]);

  const newProps: CascaderPanelProps = { ...rest };
  if (curValue !== undefined) {
    newProps.value = curValue;
  }

  return (
    <AntCascader.Panel
      {...rest}
      fieldNames={curKeys}
      options={data}
      expandIcon={getAutoIcon(expandIcon)}
      onChange={(val: any, ...rest: any) => {
        onChange?.(valueType === 'string' && Array.isArray(val) ? val.join(splitter) : val, ...rest);
      }
      }
    />
  );
});

export const Cascader: (<T extends BaseOptionType = any>(props: ICascaderProps<T>) => any) & { Panel: ICascaderPanelFC } = CascaderFC as any;

Cascader.Panel = Panel;
