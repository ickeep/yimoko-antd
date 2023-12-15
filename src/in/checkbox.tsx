import { observer } from '@formily/react';
import { IOptionsAPIProps, strToArr, useAPIOptions } from '@yimoko/store';
import { Checkbox as AntCheckbox, CheckboxProps as AntCheckboxProps, CheckboxRef } from 'antd';
import { CheckboxChangeEvent, CheckboxOptionType } from 'antd/lib/checkbox';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { ComponentProps, forwardRef, useMemo } from 'react';

export interface CheckboxProps extends Omit<AntCheckboxProps, 'onChange'> {
  values?: { true: any, false: any }
  onChange?: (value: any, e: CheckboxChangeEvent) => void
}

const CheckboxFC = forwardRef<CheckboxRef, CheckboxProps>((props, ref) => {
  const { checked, value, values, onChange, ...rest } = props;
  const curValue = useMemo(() => {
    if (checked !== undefined) {
      return checked;
    }
    if (value !== undefined) {
      if (values) {
        return value === values.true;
      }
      return value;
    }
    return undefined;
  }, [checked, value, values]);

  const newProps: CheckboxProps = { ...rest };
  if (curValue !== undefined) {
    newProps.checked = curValue;
  }
  if (value !== undefined) {
    newProps.value = value;
  }

  return (
    <AntCheckbox
      {...newProps}
      ref={ref}
      onChange={(e) => {
        const { checked } = e.target;
        if (values) {
          onChange?.(checked ? values.true : values.false, e);
        } else {
          onChange?.(checked, e);
        }
      }} />
  );
});

export type CheckboxGroupProps = Omit<ComponentProps<typeof AntCheckbox.Group>, 'onChange'> & {
  onChange?: (v: string | CheckboxValueType[]) => void
} & IOptionsAPIProps<keyof CheckboxOptionType>;

const Group = observer((props: CheckboxGroupProps) => {
  const { options, api, keys, splitter, valueType, value, onChange, ...rest } = props;
  const curValue = useMemo(() => {
    if (typeof value === 'string') {
      return strToArr(value, splitter);
    }
    return value;
  }, [splitter, value]);

  const [data] = useAPIOptions<any>(options, api, keys, splitter) as any;

  const newProps: CheckboxGroupProps = { ...rest };
  if (value !== undefined) {
    newProps.value = curValue;
  }

  return (
    <AntCheckbox.Group
      {...newProps}
      options={data}
      onChange={(v) => {
        if (valueType === 'string') {
          onChange?.(v.join(splitter));
        } else {
          onChange?.(v);
        }
      }} />
  );
}, { forwardRef: true });

type ICheckboxFC = typeof CheckboxFC & {
  Group: typeof Group
};

export const Checkbox = CheckboxFC as ICheckboxFC;

Checkbox.Group = Group;
