import TIcon from '@ant-design/icons';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import { RenderValue, judgeIsSuccess, useAPIExecutor, useConfig } from '@yimoko/store';
import { Spin } from 'antd';
import htmr from 'htmr';
import React, { HTMLAttributes, ReactNode, forwardRef, useEffect, useMemo, useState } from 'react';

import { IConfig } from '../store/config';

export type IconProps = Partial<Omit<CustomIconComponentProps, 'component'>> & Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  name?: string
  value?: string
};

const fetchMap: Record<string, Promise<string | null>> = {};
const { icons = {} } = globalThis as any;

export const Icon = forwardRef<HTMLSpanElement, IconProps>((props, ref) => {
  const { name, value, ...args } = props;
  const http = useAPIExecutor();
  const [loading, setLoading] = useState(false);
  const { static: { icon = '' } = {} } = useConfig<IConfig>();

  const file = name ?? value ?? '';
  const src = useMemo(() => (file.includes('://') ? file : `${icon + file}.svg`), [file, icon]);
  const component = icons[file];

  useEffect(() => {
    if (!component) {
      const fetch = fetchMap[src] ?? (fetchMap[src] = new Promise((resolve) => {
        http({ url: src }).then(res => resolve(judgeIsSuccess(res) ? res.data : null));
      }));
      setLoading(true);
      fetch.then((data) => {
        data && (icons[file] = () => (data ? htmr(data) : null));
        delete fetchMap[src];
        setLoading(false);
      });
    }
  }, [component, file, http, src]);

  if (component) {
    return <RenderValue value={TIcon} props={{ component, ...args, ref }} />;
  }

  return <Spin size='small' spinning={loading} />;
});

export const getAutoIcon: <T = ReactNode>(name: T) => (T | ReactNode) = (name) => {
  if (typeof name === 'string' && name) {
    return <Icon name={name} />;
  }
  return name;
};

export const getAllowClear = (v?: boolean | { clearIcon?: ReactNode | string }) => {
  if (typeof v === 'object' && v?.clearIcon) {
    return { clearIcon: getAutoIcon(v.clearIcon) };
  }
  return v;
};
