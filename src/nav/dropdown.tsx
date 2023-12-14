import { observer } from '@formily/react';
import { IOptionsAPIProps, useAPIOptions } from '@yimoko/store';
import { Dropdown as AntDropdown, DropdownProps } from 'antd';
import { DropdownButtonProps } from 'antd/es/dropdown';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { FC } from 'react';

import { getAutoIcon } from '../base/icon';

type IDropdownFC = FC<DropdownProps & Omit<IOptionsAPIProps<keyof ItemType>, 'valueType'>>;

const DropdownFC: IDropdownFC = observer((props: DropdownProps & Omit<IOptionsAPIProps<keyof ItemType>, 'valueType'>) => {
  const { options, api, keys, splitter, menu, ...rest } = props;
  const [data] = useAPIOptions(menu?.items ?? options, api, keys, splitter) as unknown as [ItemType[]];

  return <AntDropdown  {...rest} menu={{ ...menu, items: data }} />;
});

const DButton = observer((props: DropdownButtonProps & Omit<IOptionsAPIProps<keyof ItemType>, 'valueType'>) => {
  const { options, api, keys, splitter, menu, icon, ...rest } = props;
  const [data] = useAPIOptions(menu?.items ?? options, api, keys, splitter) as unknown as [ItemType[]];

  return <AntDropdown.Button  {...rest} menu={{ ...menu, items: data }} icon={getAutoIcon(icon)} />;
});

type IDropdown = IDropdownFC & {
  Button: typeof DButton;
};

const Dropdown = DropdownFC as IDropdown;

Dropdown.Button = DButton;
