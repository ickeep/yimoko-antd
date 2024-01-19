import { ComponentType } from 'react';

import { Button } from './base/button';
import { FloatButton } from './base/float-button';
import { Icon } from './base/icon';
import { LoadDepend } from './base/load-depend';
import { RemoteComponent } from './base/remote-component';
import { Paragraph, Title, Text, Typography } from './base/typography';
import { Alert } from './feedback/alert';
import { Drawer } from './feedback/drawer';
import { ErrorContent } from './feedback/error-content';
import { Modal } from './feedback/modal';
import { Popconfirm } from './feedback/popconfirm';
import { Progress } from './feedback/progress';
import { Result } from './feedback/result';
import { Skeleton } from './feedback/skeleton';
import { Spin } from './feedback/spin';

import { Watermark } from './feedback/watermark';
import { AutoComplete } from './in/auto-complete';
import { Cascader } from './in/cascader';
import { Checkbox } from './in/checkbox';
import { ColorPicker } from './in/color-picker';
import { DatePicker } from './in/date-picker';
import { Form } from './in/form';
import { Input } from './in/input';
import { InputNumber } from './in/input-number';
import { Mentions } from './in/mentions';
import { Radio } from './in/radio';
import { Rate } from './in/rate';
import { Select } from './in/select';
import { Slider } from './in/slider';
import { Switch } from './in/switch';
import { TimePicker } from './in/time-picker';
import { Transfer } from './in/transfer';
import { TreeSelect } from './in/tree-select';
import { Upload } from './in/upload';

import { Divider } from './layout/divider';
import { Flex } from './layout/flex';
import { Col, Row } from './layout/grid';
import { Content, Footer, Header, Layout, Sider } from './layout/layout';
import { Space } from './layout/space';

import { Anchor } from './nav/anchor';
import { Breadcrumb } from './nav/breadcrumb';
import { Dropdown } from './nav/dropdown';
import { Menu } from './nav/menu';
import { Pagination } from './nav/pagination';
import { Steps } from './nav/steps';

import { Affix } from './other/affix';
import { App } from './other/app';
import { ConfigProvider } from './other/config-provider';

import { Avatar } from './out/avatar';
import { Badge } from './out/badge';
import { Calendar } from './out/calendar';
import { CancelTrigger } from './out/cancel-trigger';
import { Card } from './out/card';
import { Carousel } from './out/carousel';
import { Collapse } from './out/collapse';
import { DateDisplay } from './out/date-display';
import { Descriptions } from './out/descriptions';
import { Empty } from './out/empty';
import { Image } from './out/image';
import { KeyToVal } from './out/key-to-val';
import { Link } from './out/link';
import { List } from './out/list';
import { OkTrigger } from './out/ok-trigger';
import { Popover } from './out/popover';
import { QRCode } from './out/qr-code';
import { RunTrigger } from './out/run-trigger';
import { Segmented } from './out/segmented';
import { Statistic } from './out/statistic';
import { Table } from './out/table';
import { Tabs } from './out/tabs';
import { Tag } from './out/tag';
import { Timeline } from './out/timeline';
import { Tooltip } from './out/tooltip';
import { Tour } from './out/tour';
import { Tree } from './out/tree';
import { JSONEditor } from './pro/json-editor';
import { RowAction } from './store/action/row-action';
import { RowActionDel } from './store/action/row-action-del';
import { RowActionSwitch } from './store/action/row-action-switch';
import { StoreDesc } from './store/desc';
import { FormItem, StoreForm } from './store/form';
import { ListBarForm } from './store/list-bar-form';
import { PageBarHeader } from './store/page-bar-header';
import { Reset } from './store/reset';
import { Submit } from './store/submit';
import { StoreTable } from './store/table';

export const components: Record<string, ComponentType<any>> = {
  // base
  Button,
  FloatButton,
  Icon,
  Typography,
  Text,
  Title,
  Paragraph,
  LoadDepend,
  RemoteComponent,

  // feedback
  Alert,
  Drawer,
  ErrorContent,
  Modal,
  Popconfirm,
  Progress,
  Result,
  Skeleton,
  Spin,
  Loading: Spin,
  Watermark,

  // in
  AutoComplete,
  Cascader,
  Checkbox,
  ColorPicker,
  DatePicker,
  Form,
  FormItem,
  Input,
  InputNumber,
  Mentions,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,

  // layout
  Divider,
  Flex,
  Row,
  Col,
  Layout,
  Header,
  Footer,
  Content,
  Sider,
  Space,

  // nav
  Anchor,
  Breadcrumb,
  Dropdown,
  Menu,
  Pagination,
  Steps,

  // other
  Affix,
  App,
  ConfigProvider,

  // out
  Avatar,
  Badge,
  Calendar,
  CancelTrigger,
  Card,
  Carousel,
  Collapse,
  DateDisplay,
  Descriptions,
  Empty,
  Image,
  List,
  KeyToVal,
  Link,
  OkTrigger,
  Popover,
  QRCode,
  Segmented,
  Statistic,
  Table,
  Tabs,
  Tag,
  Timeline,
  RunTrigger,
  Tooltip,
  Tour,
  Tree,

  // store
  StoreDesc,
  StoreForm,
  StoreTable,

  ListBarForm,
  PageBarHeader,

  RowActionDel,
  RowActionSwitch,
  RowAction,

  Reset,
  Submit,

  // pro
  JSONEditor,
};
