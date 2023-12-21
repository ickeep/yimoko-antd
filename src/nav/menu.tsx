import { observer } from '@formily/react';
import { IOptionsAPIProps, useAPIOptions, useAdditionalNode } from '@yimoko/store';
import { Menu as AntMenu, MenuItemProps, SubMenuProps } from 'antd';
import { MenuItemGroupProps } from 'antd/lib/menu';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import React, { ComponentProps, FC } from 'react';

import { getAutoIcon } from '../base/icon';

export type IMenuFC = FC<ComponentProps<typeof AntMenu> & Omit<IOptionsAPIProps<keyof ItemType>, 'valueType'>>;

const MenuFC: IMenuFC = observer((props) => {
  const { options, api, keys, splitter, items, expandIcon, overflowedIndicator, ...rest } = props;
  const [data] = useAPIOptions(items ?? options, api, keys, splitter) as unknown as [ItemType[]];
  // @ts-ignore
  const curExpandIcon = useAdditionalNode('expandIcon', expandIcon);
  const curOverflowedIndicator = useAdditionalNode('overflowedIndicator', overflowedIndicator);

  return <AntMenu {...rest} items={data} expandIcon={curExpandIcon} overflowedIndicator={curOverflowedIndicator} />;
}, { forwardRef: true });

export const Menu = Object.assign(MenuFC, AntMenu);

const Item = (props: MenuItemProps) => {
  const { icon, title, ...rest } = props;
  const curTitle = useAdditionalNode('title', title);

  return <AntMenu.Item {...rest} icon={getAutoIcon(icon)} title={curTitle} />;
};

Menu.Item = Item;

const SubMenu = (props: SubMenuProps) => {
  const { icon, title, ...rest } = props;
  const curTitle = useAdditionalNode('title', title);

  return <AntMenu.SubMenu {...rest} icon={getAutoIcon(icon)} title={curTitle} />;
};

Menu.SubMenu = SubMenu;

const ItemGroup = (props: MenuItemGroupProps) => {
  const { title, ...rest } = props;
  const curTitle = useAdditionalNode('title', title);

  return <AntMenu.ItemGroup {...rest} title={curTitle} />;
};

Menu.ItemGroup = ItemGroup;
