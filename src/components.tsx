import { ComponentType } from 'react';

import { Button } from './base/button';
import { LoadDepend } from './base/load-depend';
import { RemoteComponent } from './base/remote-component';
import { ErrorContent } from './feedback/error-content';
import { Skeleton } from './feedback/skeleton';
import { Spin } from './feedback/spin';
import { Select } from './in/select';
import { CancelTrigger } from './out/cancel-trigger';
import { Drawer } from './out/drawer';
import { Icon } from './out/icon';
import { KeyToVal } from './out/key-to-val';
import { Link } from './out/link';
import { Modal } from './out/modal';
import { OkTrigger } from './out/ok-trigger';
import { RunTrigger } from './out/run-trigger';
import { Tooltip } from './out/tooltip';

export const components: Record<string, ComponentType<any>> = {
  // base
  Button,
  LoadDepend,
  RemoteComponent,

  // feedback
  ErrorContent,
  Skeleton,
  Spin,
  Loading: Spin,

  // in
  Select,

  // out
  CancelTrigger,
  Drawer,
  Icon,
  KeyToVal,
  Link,
  Modal,
  OkTrigger,
  RunTrigger,
  Tooltip,
};
