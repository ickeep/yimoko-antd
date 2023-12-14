import { observer } from '@formily/react';
import { IOptionsAPIProps, useAPIOptions, useAdditionalNode } from '@yimoko/store';
import { Menu as AntMenu, MenuItemProps, MenuProps, SubMenuProps } from 'antd';
import { MenuItemGroupProps } from 'antd/lib/menu';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { FC } from 'react';

import { getAutoIcon } from '../base/icon';

export type IMenuFC = FC<MenuProps & Omit<IOptionsAPIProps<keyof ItemType>, 'valueType'>>;

const MenuFC: IMenuFC = observer((props) => {
  const { options, api, keys, splitter, items, expandIcon, overflowedIndicator, ...rest } = props;
  const [data] = useAPIOptions(items ?? options, api, keys, splitter) as unknown as [ItemType[]];
  // @ts-ignore
  const curExpandIcon = useAdditionalNode('expandIcon', expandIcon);
  const curOverflowedIndicator = useAdditionalNode('overflowedIndicator', overflowedIndicator);

  return <AntMenu  {...rest} items={data} expandIcon={curExpandIcon} overflowedIndicator={curOverflowedIndicator} />;
});

export type IMenu = IMenuFC & {
  Item: typeof AntMenu.Item;
  SubMenu: typeof AntMenu.SubMenu;
  Divider: typeof AntMenu.Divider;
  ItemGroup: typeof AntMenu.ItemGroup;
};

export const Menu = MenuFC as IMenu;

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

Menu.Divider = AntMenu.Divider;

const ItemGroup = (props: MenuItemGroupProps) => {
  const { title, ...rest } = props;
  const curTitle = useAdditionalNode('title', title);

  return <AntMenu.ItemGroup {...rest} title={curTitle} />;
};

Menu.ItemGroup = ItemGroup;
