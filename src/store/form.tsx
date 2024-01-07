import { Field } from '@formily/core';
import { useFieldSchema, RecursionField, observer, useForm, useField } from '@formily/react';
import { IStore, ListStore, judgeIsEmpty, useAdditionalNode, useCurStore } from '@yimoko/store';
import { Col, ColProps, FormItemProps as AntFormItemProps, FormProps, Row } from 'antd';
import { RowProps } from 'antd/lib';
import React, { ReactNode, createContext, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Form } from '../in/form';


// 创建一个 from 的上下文 用来记录布局信息
const FormContext = createContext<FormLayoutProps>({});

export const StoreForm = observer((props: StoreFormProps) => {
  const { fields, store, children, onSubmitCapture, row, col, ...args } = props;
  const curStore = useCurStore(store);
  const location = useLocation();
  const nav = useNavigate();
  const form = useForm();

  const autoSubmit = (values: any) => {
    onSubmitCapture?.(values);
    form?.submit?.().then(() => {
      curStore?.runAPI();
      const isList = curStore instanceof ListStore;
      if (isList && curStore.isBindRouter) {
        const { pathname, search } = location;
        const valSearch = curStore.getURLSearch();
        search !== `?${valSearch}` && nav(`${pathname}?${valSearch}`, { replace: curStore.queryRoutingType === 'replace' });
      }
    });
  };

  const el = <><StoreFormFields fields={fields} store={curStore} />{children}</>;

  return (
    <FormContext.Provider value={{ row, col }}>
      <Form {...args} onSubmitCapture={autoSubmit}>
        {judgeIsEmpty(row) ? el : <Row {...(row === true ? {} : row)}>{el}</Row>}
      </Form>
    </FormContext.Provider>
  );
});

export type FormItemProps = AntFormItemProps & Pick<FormLayoutProps, 'col'>;
// eslint-disable-next-line complexity
export const FormItem = observer((props: FormItemProps) => {
  const { required, label, help, validateStatus, extra, col, ...args } = props;
  const field = (useField() ?? {}) as Field;
  const curRequired = required ?? field?.required;
  const curValidateStatus = validateStatus ?? (field.errors?.length > 0 ? 'error' : undefined);
  const curExtra = useAdditionalNode('extra', extra);
  const curHelp = useAdditionalNode('help', help) ?? field.errors?.[0]?.messages?.[0];
  const curLabel = useAdditionalNode('label', label) ?? field.title;

  const fEl = (
    <Form.Item
      {...args}
      required={curRequired}
      label={curLabel}
      help={curHelp}
      extra={curExtra}
      validateStatus={curValidateStatus}
    />);

  // 或者上下文中的 row
  const context = useContext(FormContext);
  if (judgeIsEmpty(context.row)) {
    return fEl;
  }
  return <Col {...context.col} {...col} >{fEl}</Col>;
});

const StoreFormFields = observer((props: StoreFormFieldsProps) => {
  const { fields = [] } = props;
  const schema = useFieldSchema();

  if (!(fields?.length > 0)) {
    return null;
  }

  const properties: Record<string, any> = {};

  fields.forEach((field) => {
    if (typeof field === 'string') {
      properties[field] = { $ref: `#/definitions/${field}` };
    } else {
      const { field: f, formItem, ...args } = field;
      properties[f] = { $ref: `#/definitions/${f}`, ...args };
      if (!judgeIsEmpty(formItem)) {
        properties[f]['x-decorator'] = 'FormItem';
        properties[f]['x-decorator-props'] = formItem;
      }
    }
  });

  return <RecursionField schema={{ ...schema, 'x-component': undefined, 'x-decorator': undefined, properties }} />;
});

export interface StoreFormFieldsProps {
  fields?: Array<string | IStoreFormField>
  store?: IStore
}

export interface IStoreFormField {
  field: string,
  'formItem'?: FormItemProps
  [key: string]: any
}

export type StoreFormProps = Omit<FormProps, 'fields'> & StoreFormFieldsProps & { children?: ReactNode } & FormLayoutProps;

export interface FormLayoutProps {
  row?: Omit<RowProps, 'children'> | true
  col?: Omit<ColProps, 'children'>
}
