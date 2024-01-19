import { MenuProps, Tree } from 'antd';
import { DataNode } from 'antd/es/tree';
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';

import { ButtonDemo } from './base/button';
import { CheckboxDemo } from './in/checkbox';
import { ColorPickerDemo } from './in/color-picker';
import { DatePickerDemo } from './in/date-picker';
import { FormDemo } from './in/form';
import { FlexDemo } from './layout/flex';
import { GridDemo } from './layout/grid';
import { SpaceDemo } from './layout/space';
import { MenuDemo } from './nav/menu';
import { TreeDemo } from './out/tree';
import { JSONEditorDemo } from './pro/json-editor';
import { StoreDescDemo } from './store/desc';
import { StoreTableDemo } from './store/table';


export const ROUTES_CONF: Array<IRouteConf> = [
  { path: '/', name: 'index', component: () => (<Tree treeData={ROUTER_TREE_DATA} />) },
  {
    path: '/base/', name: '基础',
    children: [
      { path: 'button', name: '按钮', component: ButtonDemo },
    ],
  },
  {
    path: '/layout/', name: '布局',
    children: [
      { path: 'flex', name: 'Flex', component: FlexDemo },
      { path: 'grid', name: 'Grid 栅格', component: GridDemo },
      { path: 'space', name: 'Space间距', component: SpaceDemo },
    ],
  },
  {
    path: '/nav/', name: '导航', children: [
      { path: 'menu', name: 'Menu 导航菜单', component: MenuDemo },
    ],
  },
  {
    path: '/in/', name: '数据录入', children: [
      { path: 'checkbox', name: 'Checkbox 多选框', component: CheckboxDemo },
      { path: 'colorPicker', name: 'ColorPicker 颜色选择器', component: ColorPickerDemo },
      { path: 'datePicker', name: 'DatePicker 日期选择器', component: DatePickerDemo },
      { path: 'form', name: 'Form 表单', component: FormDemo },
    ],
  },
  {
    path: '/out/', name: '数据展示', children: [
      { path: 'tree', name: 'tree 树', component: TreeDemo },
    ],
  },
  {
    path: '/store/', name: 'store', children: [
      { path: 'desc', name: 'StoreTable desc 描述', component: StoreDescDemo },
      { path: 'table', name: 'StoreTable store 表格', component: StoreTableDemo },
    ],
  },
  {
    path: '/pro/', name: 'pro', children: [
      { path: 'json-editor', name: 'JSONEditor', component: JSONEditorDemo },
    ],
  },
];

const routes: Array<IRoute> = [];

const handleRoutesConf = (routesConfig: Array<IRouteConf>, baseUrl = '') => routesConfig.forEach((route) => {
  // 如果有子路由，则递归渲染子路由
  if ('children' in route && route.children) {
    handleRoutesConf(route.children, baseUrl + route.path);
  } else if ('component' in route && route.component) {
    routes.push({ name: route.name, component: route.component, path: baseUrl + route.path });
  }
});

handleRoutesConf(ROUTES_CONF);

export const Router = () => (
  <Routes>
    {routes.map(route => (<Route key={route.path} path={route.path} element={<route.component />} />))}
  </Routes>
);

const routesConfToMenus = (routes: Array<IRouteConf>, baseUrl = ''): MenuProps['items'] => routes.map((route) => {
  const path = baseUrl + route.path;
  if ('children' in route && route.children) {
    return {
      key: path,
      label: route.name,
      children: routesConfToMenus(route.children, path),
    };
  }
  return {
    key: path,
    label: <Link to={path}>{route.name}</Link>,
  };
});

export const ROUTER_MENUS = routesConfToMenus(ROUTES_CONF);

const routersToTreeData = (routes: Array<IRouteConf>, baseUrl = ''): Array<DataNode> => routes.map((route) => {
  const path = baseUrl + route.path;
  if ('children' in route && route.children) {
    return {
      title: route.name,
      key: path,
      children: routersToTreeData(route.children, path),
    };
  }
  return {
    title: <Link to={path}>{route.name}</Link>,
    key: path,
  };
});

export const ROUTER_TREE_DATA = routersToTreeData(ROUTES_CONF);


export type IRouteConf = {
  path: string
  name: string
} & ({ component?: React.FC<any> } | { children?: Array<IRouteConf> });

type IRoute = {
  path: string
  name: string
  component: React.FC<any>
};
