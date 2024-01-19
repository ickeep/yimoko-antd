import { Button, ButtonProps } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Back = (props: ButtonProps) => {
  const { onClick, children = '返回', ...rest } = props;

  const nav = useNavigate();

  const click: ButtonProps['onClick'] = (e) => {
    onClick?.(e);
    if (rest?.href) {
      nav(rest?.href, { replace: true });
    } else {
      nav(-1);
    }
  };

  return (
    <Button  {...rest} children={children} onClick={click} />
  );
};
