import { observer } from '@formily/react';
import { IOptionsAPIProps, judgeIsEmpty, strToArr, useAPIOptions } from '@yimoko/store';
import { Empty, EmptyProps, Tree as AntTree } from 'antd';
import { DataNode } from 'antd/lib/tree';
import React, { ComponentProps, FC, Key, useMemo } from 'react';

type IValueType = Key[] | string;
export type TreeProps<T extends object = DataNode, V = any> = Omit<ComponentProps<typeof AntTree<T>>, 'onCheck' | 'checkedKeys'> & IOptionsAPIProps & {
  onChange?: (value: V, info: any) => void
  value?: V
  //   // 为 false 去掉 value 中父节点的 key，只保留叶子节点的 key
  //   // 解决新增节点时父节点 key 存在， 新增节点也被勾选，但实际 value 中并没有 子节点的问题
  isValueHasParent?: boolean
  empty?: EmptyProps
};

export const Tree: <T extends object = DataNode, V extends IValueType = string>(props: TreeProps<T, V>) => ReturnType<FC> = observer((props) => {
  const { treeData, onChange, value, options, splitter = ',', api, keys, empty, valueType, isValueHasParent = false, ...args } = props;

  const curValue = useMemo(() => {
    if (value === undefined) {
      return undefined;
    }
    if (Array.isArray(value)) {
      return value;
    }
    return strToArr(value, splitter);
  }, [splitter, value]);

  const [data] = useAPIOptions<any>(treeData ?? options, api, keys, splitter) as any;

  const key = props.fieldNames?.key ?? 'key';

  const hasChildrenMap = useMemo(() => {
    const map = new Map<Key, true>();
    if (isValueHasParent) {
      return map;
    }
    const loop = (list: any[]) => {
      list.forEach((item) => {
        if (!judgeIsEmpty(item.children)) {
          loop(item.children);
          map.set(item[key], true);
        }
      });
    };
    loop(data ?? []);
    return map;
  }, [isValueHasParent, key, data]);

  if (judgeIsEmpty(data)) {
    return <Empty {...empty} />;
  }

  const valueProps: Record<any, any> = {};
  if (curValue !== undefined) {
    valueProps.checkedKeys = curValue;
  }

  return (
    <AntTree
      checkable
      {...args}
      {...valueProps}
      treeData={data}
      onCheck={(checkedKeys, info) => {
        let keys: Key[] = [];
        if (Array.isArray(checkedKeys)) {
          keys = checkedKeys;
        } else {
          keys = Array.isArray(checkedKeys.checked) ? checkedKeys.checked : [];
        }
        if (!isValueHasParent) {
          keys = keys.filter(item => !hasChildrenMap.has(item));
        }
        const newValue = (valueType === 'string' ? keys.join(splitter) : keys) as any;
        onChange?.(newValue, info);
      }}
    />
  );
}, { forwardRef: true });
