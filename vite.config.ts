import * as path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  publicDir: false,
  build: {
    sourcemap: !process.env.VITE_WATCH,
    target: process.env.VITE_WATCH ? 'modules' : 'es2015',
    lib: {
      formats: ['cjs', 'es', 'umd'],
      entry: path.resolve(__dirname, `src/library.ts`),
      name: `YimokoAntd`,
      fileName: format => `yimoko-antd.${format}.js`,
    },
    watch: process.env.VITE_WATCH ? { buildDelay: 100 } : null,
    outDir: path.resolve(__dirname, `dist`),
    rollupOptions: {
      external: [
        'react',
        'react-is',
        'react-dom',
        'react-router',
        'react-router-dom',
        'lodash-es',
        'axios',
        "dayjs",
        'antd',
        '@ant-design/icons',
        'classnames',
        '@formily/core',
        '@formily/reactive',
        '@formily/react',
        '@formily/reactive-react',
        '@yimoko/store',
        "jsoneditor",
        "@wangeditor/editor",
      ],
      output: {
        globals: {
          react: 'React',
          'react-is': 'ReactIs',
          'react-dom': 'ReactDOM',
          'react-router-dom': 'ReactRouterDOM',
          "dayjs": "dayjs",
          axios: 'axios',
          antd: 'antd',
          '@ant-design/icons': 'icons',
          classnames: 'classNames',
          'lodash-es': '_',
          '@formily/core': 'Formily.Core',
          '@formily/reactive-react': 'Formily.ReactiveReact',
          '@formily/react': 'Formily.React',
          '@formily/reactive': 'Formily.Reactive',
          '@yimoko/store': 'YimokoStore',
          jsoneditor: 'JSONEditor',
          "@wangeditor/editor": "wangEditor",
        },
      },
    },
  },
  plugins: [
    react({ jsxRuntime: 'classic' }),
    dts({
      // 忽略文件
      exclude: [
        'src/_demo',
        'src/index.tsx',
        'src/react-app-env.d.ts',
        'src/reportWebVitals.ts',
        'src/setupTests.ts',
      ],
      entryRoot: path.resolve(__dirname, `src`),
      outDir: path.resolve(__dirname, `types`),
    }),
  ],
});

