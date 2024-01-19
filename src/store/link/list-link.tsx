import { observer, useExpressionScope } from '@formily/react';
import { ButtonProps } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button } from '../../base/button';

export const ListLink = observer((props: ButtonProps) => {
  const nav = useNavigate();
  const location = useLocation();
  const { onClick, children = '列表', ...rest } = props;
  const scope = useExpressionScope();

  const click: ButtonProps['onClick'] = (e) => {
    onClick?.(e);
    let href = props.href ?? scope?.$config?.basePath;
    if (!href) {
      // 当前 pathname 多级的话 减少一级
      const paths = location.pathname.split('/');
      paths.pop();
      href = paths.join('/');
    }
    nav(href);
  };

  return <Button children={children}  {...rest} onClick={click} />;
});
