import { MenuOutlined } from '@ant-design/icons';
import { createSchemaField } from '@formily/react';
import { ConfigStoreProvider, SchemaFieldProvider } from '@yimoko/store';
import { ConfigProvider, Dropdown, FloatButton } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { BrowserRouter } from 'react-router-dom';

import { components, configStore } from '@/library';

import { ROUTER_MENUS, Router } from './router';

const SchemaField = createSchemaField({ components });

function App() {
  return (
    <BrowserRouter>
      <ConfigProvider locale={zhCN}>
        <ConfigStoreProvider value={configStore}>
          <SchemaFieldProvider value={SchemaField}>
            <div className="App" style={{ minHeight: '100%', padding: 20, boxSizing: 'border-box' }}>
              <Router />
              <FloatButton
                shape='square'
                description={(
                  <Dropdown menu={{ items: ROUTER_MENUS }} >
                    <div style={{ width: 40, height: 40, display: 'flex', justifyContent: 'center' }}><MenuOutlined rev="菜单" /></div>
                  </Dropdown>
                )}
              />
            </div>
          </SchemaFieldProvider>
        </ConfigStoreProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
