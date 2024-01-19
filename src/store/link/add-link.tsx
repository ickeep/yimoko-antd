import { observer, useExpressionScope } from '@formily/react';
import { ButtonProps } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button } from '../../base/button';

export const AddLink = observer((props: ButtonProps) => {
  const nav = useNavigate();
  const location = useLocation();
  const { onClick, children = '添加', ...rest } = props;
  const scope = useExpressionScope();

  const click: ButtonProps['onClick'] = (e) => {
    onClick?.(e);
    let href = props.href ?? scope?.getAddPath?.();
    if (!href) {
      href = `${location.pathname}/add`;
    }
    nav(href);
  };

  return <Button children={children} type="primary"  {...rest} onClick={click} />;
});
