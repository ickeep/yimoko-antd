import { observer } from '@formily/react';
import * as WangEditor from '@wangeditor/editor';
import { IEditorConfig, IToolbarConfig, SlateDescendant } from '@wangeditor/editor';
import React, { useEffect, useImperativeHandle, useRef } from 'react';

import { LoadDepend, LoadDependProps } from '../base/load-depend';
import { useConfig } from '../store/config';

import { DEFAULT_CDN } from './cdn';

const bVal = '1px solid #f0f0f0';

export const LoadDependHtmlEditor = observer((props: Omit<LoadDependProps, 'js' | 'css'>) => {
  const config = useConfig();
  return (
    <LoadDepend
      {...props}
      js={config?.deep?.wangEditor?.js ?? [{ src: `${DEFAULT_CDN}wangeditor5/5.1.23/index.min.js`, name: 'wangEditor' }]}
      css={config?.deep?.wangEditor?.css ?? [`${DEFAULT_CDN}wangeditor5/5.1.23/css/style.min.css`]}
    />
  );
});

export const HtmlEditor = React.forwardRef((props: HtmlEditorProps, ref) => (
  <LoadDependHtmlEditor >
    <HtmlEditorContent {...props} ref={ref} />
  </LoadDependHtmlEditor>
));

const HtmlEditorContent = React.forwardRef((props: HtmlEditorProps, ref) => {
  const g = globalThis as Record<string, any>;
  const wangEditor = g.wangEditor as typeof WangEditor;
  const { value, onChange, toolbar: toolbarConf, editor: editorConf, style, ...rest } = props;
  const editorEL = useRef<HTMLDivElement>(null);
  const toolbarEL = useRef<HTMLDivElement>(null);

  const editor = useRef<WangEditor.IDomEditor>();
  const toolbar = useRef<WangEditor.Toolbar>();

  useImperativeHandle(ref, () => ({
    editor: editor.current,
    toolbar: toolbar.current,
  }), []);

  useEffect(() => {
    if (editorEL.current && !editor.current) {
      editor.current = wangEditor.createEditor({
        selector: editorEL.current,
        config: {
          ...editorConf?.config,
          onChange: (er) => {
            const html = er.getHtml();
            if (html !== props.value) {
              props?.onChange?.(er.getHtml(), er);
              editorConf?.config?.onChange?.(er);
            }
          },
          onDestroyed: (er) => {
            editorConf?.config?.onDestroyed?.(er);
            editor.current = undefined;
          },
        },
        mode: editorConf?.mode ?? 'default',
        content: editorConf?.content,
        html: editorConf?.html,
      });
    }
    // 使用 props 特意忽略 onChange
  }, [editorConf?.config, editorConf?.content, editorConf?.html, editorConf?.mode, props, wangEditor]);

  useEffect(() => {
    if (toolbarConf !== false && toolbarEL.current && !toolbar.current && editor.current) {
      const er = wangEditor.createToolbar({
        editor: editor.current,
        selector: toolbarEL.current,
        config: toolbarConf?.config,
        mode: toolbarConf?.mode,
      });
      toolbar.current = er;
    }
  }, [editor, toolbarConf, wangEditor]);

  // value 变化，重置 HTML
  useEffect(() => {
    if (editor.current && value !== editor.current.getHtml()) {
      try {
        editor.current.setHtml(value ?? '');
      } catch (error) {
        console.error(error);
      }
    }
  }, [value]);

  return (
    <div {...rest} style={{ border: bVal, zIndex: 100, ...style }}>
      {toolbarConf !== false && <div className={toolbarConf?.className} style={{ borderBottom: bVal, ...toolbarConf?.style }} ref={toolbarEL} />}
      <div className={editorConf?.className} ref={editorEL} style={{ height: '400px', overflowY: 'hidden', ...editorConf?.style }} />
    </div>
  );
});

export type HtmlEditorProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  value?: string;
  onChange?: (value: string, ...rest: any[]) => void;
  toolbar?: false | {
    config?: Partial<IToolbarConfig>;
    className?: string;
    mode?: string;
    style?: React.CSSProperties;
  }
  editor?: {
    config?: Partial<IEditorConfig>;
    content?: SlateDescendant[];
    html?: string;
    className?: string;
    mode?: string;
    style?: React.CSSProperties;
  }
};
