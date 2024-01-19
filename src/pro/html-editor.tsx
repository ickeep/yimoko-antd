import { observer } from '@formily/react';
import { IDomEditor, IEditorConfig, IToolbarConfig, SlateDescendant } from '@wangeditor/editor';
import { Editor as WEditor, Toolbar as WToolbar } from '@wangeditor/editor-for-react';
import { judgeIsSuccess } from '@yimoko/store';
import React, { useState, useEffect, useMemo, ReactNode } from 'react';
import { LoadDepend, LoadDependProps } from 'src/base/load-depend';

// import { IUploadOptions, LoadDependCOS, UploadByCOS } from '../tools/cos';
export interface HtmlEditorProps {
  value: string;
  onChange?: (value: string, ...rest: any[]) => void;
  // upload?: IUploadOptions
  toolbar?: {
    defaultConfig?: Partial<IToolbarConfig>;
    className?: string;
    mode?: string;
    style?: React.CSSProperties;
  }
  editor?: {
    defaultConfig?: Partial<IEditorConfig>;
    defaultContent?: SlateDescendant[];
    defaultHtml?: string;
    className?: string;
    mode?: string;
    style?: React.CSSProperties;
  }
}

const bVal = '1px solid #d9d9d9';


export const LoadDependHtmlEditor = observer((props: Omit<LoadDependProps, 'js' | 'css'>) => (
  <LoadDepend
    js={[
      { src: 'https://cdn.staticfile.org/KaTeX/0.16.4/katex.min.js', name: 'katex' },
      { src: 'https://cdn.staticfile.org/wangeditor5/5.1.23/index.min.js', name: 'wangEditor' },
    ]}
  >
    <LoadDepend {...props}
      js={[
        { src: 'https://npm.ickeep.com/@wangeditor/editor-for-react/1.0.6/dist/index.min.js', name: 'WangEditorForReact' },
        { src: 'https://npm.ickeep.com/@wangeditor/plugin-formula/1.0.11/dist/index.min.js', name: 'WangEditorPluginFormula' },
      ]}
    />
  </LoadDepend>
));

const HtmlEditorRegister = observer(({ children }: { children: ReactNode }) => {
  useEffect(() => {
    if (!isRegister) {
      isRegister = true;
      const g = globalThis as Record<string, any>;
      g.wangEditor.Boot.registerModule(g.WangEditorPluginFormula.default);
    }
  }, []);
  return <>{children}</>;
});

let isRegister = false;

export const HtmlEditor = observer((props: HtmlEditorProps) => (
  <LoadDependHtmlEditor >
    <HtmlEditorRegister >
      <HtmlEditorContent {...props} />
    </HtmlEditorRegister>
  </LoadDependHtmlEditor>
));

const HtmlEditorContent = observer((props: HtmlEditorProps) => {
  const { value, onChange, toolbar, editor: editorConf, upload } = props;
  const [editor, setEditor] = useState<IDomEditor | null>(null);

  // const imgUploader = useMemo(() => getUploader(upload, 'img'), [upload]);
  // const videoUploader = useMemo(() => getUploader(upload, 'video'), [upload]);

  const curToolBar = useMemo(() => ({
    mode: 'default',
    style: { borderBottom: bVal }, ...toolbar,
    defaultConfig: {
      insertKeys: {
        index: 0,
        keys: [
          'insertFormula', // “插入公式”菜单
          'editFormula', // “编辑公式”菜单
        ],
      },
      ...toolbar?.defaultConfig,
    },
  }), [toolbar]);

  const curEditorConf: HtmlEditorProps['editor'] = useMemo(() => ({
    mode: 'default',
    ...editorConf,
    style: { height: '400px', overflowY: 'hidden', ...editorConf?.style },
    defaultConfig: {
      placeholder: '请输入内容...', hoverbarKeys: {
        formula: {
          menuKeys: ['editFormula'], // “编辑公式”菜单
        },
      },
      // MENU_CONF: {
      //   uploadImage: {
      //     customUpload: imgUploader,
      //   },
      //   uploadVideo: {
      //     customUpload: videoUploader,
      //   },
      // },
      ...editorConf?.defaultConfig,
    },
  }), [editorConf]);

  // 及时销毁 editor ，重要！
  useEffect(() => () => {
    if (editor === null) return;
    editor.destroy();
    setEditor(null);
  }, [editor]);
  const g = globalThis as Record<string, any>;
  const Editor = g.WangEditorForReact.Editor as typeof WEditor;
  const Toolbar = g.WangEditorForReact.Toolbar as typeof WToolbar;

  return (
    <div style={{ border: bVal, zIndex: 100 }}>
      <Toolbar {...curToolBar} editor={editor} />
      <Editor
        {...curEditorConf}
        value={value}
        onCreated={setEditor}
        // @ts-ignore
        onChange={editor => editor.getText() !== value && onChange?.(editor.getHtml(), editor)}
      />
    </div>
  );
});

type InsertFnType = (url: string, alt: string, href: string) => void;
