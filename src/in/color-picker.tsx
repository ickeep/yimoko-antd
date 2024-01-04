import { ColorPicker as AntColorPicker, ColorPickerProps } from 'antd';
import { Color } from 'antd/lib/color-picker';
import React from 'react';

// 适配 schema  将 onChange 第一个参数改为字符串并支持选择类型 hex | rgb | rgba
export const ColorPicker = (props: Omit<ColorPickerProps, 'onChange'> & { valueType?: 'hex' | 'hsb' | 'rgb', onChange?: (str: string, color: Color) => void }): any => {
  const { onChange, valueType, ...rest } = props;
  return (
    <AntColorPicker
      {...rest}
      onChange={(v, hex) => {
        let val = hex;
        if (valueType === 'hsb') {
          val = v.toHsbString();
        }
        if (valueType === 'rgb') {
          val = v.toRgbString();
        }
        onChange?.(val, v);
      }}
    />
  );
};
