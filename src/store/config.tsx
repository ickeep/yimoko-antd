import { ConfigStore, IVersion, httpRequest } from '@yimoko/store';

import { LoadDependProps } from '../base/load-depend';
import { components } from '../components';
import { notifier } from '../feedback/notifier';
import { useRouter } from '../hook/use-router';

export type IDeepConfig = Pick<LoadDependProps, 'js' | 'css'>;

const staticConfig: { img?: string, icon?: string, js?: string, css?: string } = { img: '', icon: '', js: '', css: '' };
const versionConfig: { img?: IVersion, icon?: IVersion, js?: IVersion, css?: IVersion } = {};
const deepConfig: { [key: string]: IDeepConfig } = {};

export const defaultConfig = {
  static: staticConfig,
  version: versionConfig,
  deep: deepConfig,

  versionKey: '',
  apiHost: '',
  uploadAPI: '',
  indexPage: '',
  pageCachePrefix: '',
};

export type IConfig = typeof defaultConfig;

export const configStore: ConfigStore<typeof defaultConfig> = new ConfigStore(
  defaultConfig,
  { components, notifier, apiExecutor: httpRequest, useRouter },
);

export const { logger } = configStore;

