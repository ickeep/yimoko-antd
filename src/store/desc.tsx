import { createForm } from '@formily/core';
import { ISchema, observer } from '@formily/react';
import { IStore, SchemaBox, judgeIsEmpty, useCurStore, useSchemaField, RenderValue } from '@yimoko/store';
import { DescriptionsProps } from 'antd';
import { DescriptionsItemProps } from 'antd/es/descriptions/Item';
import { get } from 'lodash-es';
import React, { FC, isValidElement, useMemo } from 'react';

import { Space } from '../layout/space';
import { Descriptions } from '../out/descriptions';
import { Tooltip, TooltipProps } from '../out/tooltip';

interface IFieldObj extends Partial<DescriptionsItemProps> {
  field: string | number | symbol
  tooltip?: TooltipProps
  schema?: ISchema
}

export interface StoreDescProps<T extends object = Record<any, any>> extends Omit<DescriptionsProps, 'items'> {
  fields?: Array<keyof T | string | IFieldObj>
  store?: IStore
  valuesTarget?: 'values' | 'response.data' | string
  tipIcon?: TooltipProps['icon']
  items?: Array<keyof T | string | IFieldObj>
}

export const StoreDesc: <T extends object = Record<any, any>>(props: StoreDescProps<T>) => ReturnType<FC> = observer((props) => {
  const { fields, store, items, valuesTarget = 'values', tipIcon, ...args } = props;
  const SchemaField = useSchemaField();
  const curStore = useCurStore(store);
  const { fieldsConfig } = curStore ?? {};
  const curValues = get(curStore, valuesTarget);

  const curItems = useMemo(() => {
    const arr = items ?? fields ?? [];
    // eslint-disable-next-line complexity
    return arr.map((item) => {
      const itemObj: IFieldObj = typeof item !== 'object' ? { field: item } : item;
      const { field, tooltip, schema, ...rest } = itemObj;
      const fc = fieldsConfig?.[field];
      const { title, tooltip: fTooltip, desc: { schema: dSchema = undefined, tooltip: dTooltip = undefined, ...dArgs } = {} } = fc ?? {};
      const itemProps: DescriptionsItemProps = { children: null, label: title, ...dArgs, ...rest };

      let tooltipProps: TooltipProps = {};
      [fTooltip, dTooltip, tooltip].forEach((item) => {
        if (!judgeIsEmpty(item)) {
          if ((isValidElement(item) || typeof item !== 'object')) {
            tooltipProps.title = item;
          } else {
            tooltipProps = { ...tooltipProps, ...item };
          }
        }
      });

      if (!judgeIsEmpty(tooltipProps)) {
        judgeIsEmpty(tooltipProps.icon) && tipIcon && (tooltipProps.icon = tipIcon);
        itemProps.label = <Space size={4} ><span>{itemProps.label}</span><Tooltip  {...tooltipProps} /></Space >;
      }

      const curSchema = schema ?? dSchema;
      if (judgeIsEmpty(itemProps.children) && field) {
        if (judgeIsEmpty(curSchema)) {
          itemProps.children = <RenderValue value={get(curValues, field)} />;
        } else {
          itemProps.children = (
            <SchemaBox model={createForm({ values: { ...curValues } })} >
              <SchemaField schema={{ type: 'object', properties: { [field]: curSchema } }} />
            </SchemaBox>
          );
        }
      }

      return itemProps;
    });
  }, [SchemaField, curValues, fields, fieldsConfig, items, tipIcon]);

  return <Descriptions {...args} items={curItems} />;
});
