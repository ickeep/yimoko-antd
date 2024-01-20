import { observer } from '@formily/react';
import { useDeepEffect } from '@yimoko/store';
import JsonEditor, { JSONEditorOptions } from 'jsoneditor';
import { isEqual } from 'lodash-es';
import React, { FC, ReactNode, useEffect, useImperativeHandle, useMemo, useRef } from 'react';

import { LoadDepend, LoadDependProps } from '../base/load-depend';
import { useConfig } from '../store/config';

import { DEFAULT_CDN } from './cdn';

export const LoadDependJsonEditor = observer((props: Omit<LoadDependProps, 'js' | 'css'>) => {
  const config = useConfig();
  const depend = config?.deep?.jsonEditor;
  return (
    <LoadDepend
      {...props}
      js={depend?.js ?? [{ src: `${DEFAULT_CDN}jsoneditor/10.0.0/jsoneditor.min.js`, name: 'JSONEditor' }]}
      css={depend?.css ?? [`${DEFAULT_CDN}jsoneditor/10.0.0/jsoneditor.min.css`]}
    />
  );
});

export const JSONEditor: <T = any>(props: JSONEditorProps<T>) => ReturnType<FC> = React.forwardRef((props, ref) => (
  <LoadDependJsonEditor >
    <JSONEditorContent {...props} ref={ref} />
  </LoadDependJsonEditor>
));

const JSONEditorContent = React.forwardRef((props: JSONEditorProps, ref: React.Ref<{ editor?: JsonEditor } | undefined>) => {
  const { value, onChange, type, readOnly, disabled, children, style, ...rest } = props;
  const elRef = useRef<HTMLDivElement>(null);
  const curType = useMemo(() => type ?? (typeof value === 'string' ? 'string' : 'object'), [type, value]);
  // 使用 ref 保存 editor 实例 严格模式不会在 effect 里重复创建
  const editorRef = useRef<JsonEditor>();
  const editor = editorRef.current;

  useImperativeHandle(ref, () => ({
    // 必须使用 editorRef.current 取 editor 返回为 undefined
    editor: editorRef.current,
  }), []);

  useDeepEffect(() => {
    if (elRef.current && !editorRef.current) {
      const curRest: JSONEditorOptions = (readOnly || disabled) ? { ...rest, mode: 'preview', modes: ['view', 'preview'] } : rest;
      // 大组件使用按需加载 umd 依赖
      const g = globalThis as Record<string, any>;
      const EDITOR = g.JSONEditor as typeof JsonEditor;
      const jEditor = new EDITOR(elRef.current, {
        language: 'zh-CN',
        mode: 'code',
        modes: ['tree', 'view', 'form', 'code', 'text', 'preview'],
        ...curRest,
        onChange: () => {
          // fn 会导致每次都重新渲染，使用 props.onChange
          if (props.onChange) {
            if (curType === 'string') {
              props.onChange(jEditor.getText());
            } else {
              jEditor.validate().then((errors) => {
                if (errors.length < 1) {
                  props.onChange?.(jEditor.get());
                }
              });
            }
          }
        },
      });
      // 初始化值 editor 使用 ref 保存 当其变化时不会触发 effect
      jEditor.set(props.value);
      editorRef.current = jEditor;
    }
  }, [rest, disabled, readOnly]);

  useEffect(() => {
    if (editor) {
      if (typeof value === 'string') {
        const oldVal = editor.getText();
        if (oldVal !== value) {
          editor.setText(value);
        }
      } else {
        const oldVal = editor.get();
        if (!isEqual(oldVal, value)) {
          editor.set(value);
        }
      }
    }
  }, [editor, value]);

  useEffect(() => () => editor?.destroy(), [editor]);

  return <><div ref={elRef} style={{ width: '100%', ...style }} />{children}</>;
});

export interface JSONEditorProps<T = any> extends Omit<JSONEditorOptions, 'onChange'> {
  type?: 'string' | 'object';
  value?: T;
  readOnly?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  onChange?: (value: T) => void;
  style?: React.CSSProperties;
  ref: React.Ref<{ editor?: JsonEditor } | undefined>
}
