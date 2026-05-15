import type { App } from 'vue'

import './shared/styles/base.scss'
import AffixInstall, { Affix } from './affix'
import AlertInstall, { Alert } from './alert'
import AnchorInstall, { Anchor } from './anchor'
import AutoCompleteInstall, { AutoComplete } from './auto-complete'
import AvatarInstall, { Avatar } from './avatar'
import AvatarGroupInstall, { AvatarGroup, avatarGroupInjectionKey, resolveAvatarSize } from './avatar-group'
import BadgeInstall, { Badge } from './badge'
import BadgeRibbonInstall, { BadgeRibbon, isRibbonPresetColor } from './badge-ribbon'
import BreadcrumbInstall, { Breadcrumb, BreadcrumbItem } from './breadcrumb'
import ButtonInstall, { Button, ButtonGroup } from './button'
import Button3DInstall, { Button3d } from './button-3d'
import CalendarInstall, { Calendar } from './calendar'
import CardInstall, { Card } from './card'
import CardMetaInstall, { CardMeta } from './card-meta'
import CarouselInstall, { Carousel } from './carousel'
import CascaderInstall, { Cascader, CASCADER_SHOW_CHILD, CASCADER_SHOW_PARENT } from './cascader'
import CheckBoxInstall, { CheckBox } from './check-box'
import CheckableTagInstall, { CheckableTag, CheckableTagGroup, checkableTagGroupInjectionKey } from './checkable-tag'
import CollapseInstall, { Collapse, CollapseItem } from './collapse'
import ColorPickerInstall, { ColorPicker } from './color-picker'
import ConfigProviderInstall, { ConfigProvider, useConfig } from './config-provider'
import DatePickerInstall, { DatePicker } from './date-picker'
import DescriptionsInstall, { Descriptions, DescriptionsItem } from './descriptions'
import DirectoryTreeInstall, { DirectoryTree } from './directory-tree'
import DividerInstall, { Divider } from './divider'
import DrawerInstall, { Drawer } from './drawer'
import DropdownInstall, { Dropdown } from './dropdown'
import DropdownButtonInstall, { DropdownButton } from './dropdown-button'
import EmptyInstall, { Empty } from './empty'
import FlexInstall, { Flex } from './flex'
import FloatButtonInstall, { BackTop, FloatButton } from './float-button'
import FormInstall, { Form, FormItem, FormList, FormProvider } from './form'
import GridInstall, { Col, Row } from './grid'
import IconInstall, {
  addAPIProvider,
  addCollection,
  addIcon,
  loadIcon,
  loadIcons,
  clearIconRegistry,
  Icon,
  registerIcon,
  resolveIcon,
  unregisterIcon,
} from './icon'
import ImageInstall, { Image } from './image'
import ImagePreviewGroupInstall, { ImagePreviewGroup } from './image-preview-group'
import InputInstall, { Input } from './input'
import InputNumberInstall, { InputNumber } from './input-number'
import InputOtpInstall, { InputOtp } from './input-otp'
import InputSearchInstall, { InputSearch } from './input-search'
import LayoutInstall, { Content, Footer, Header, Layout, Sider } from './layout'
import MasonryInstall, { Masonry } from './masonry'
import MentionsInstall, { Mentions } from './mentions'
import MenuInstall, { Menu } from './menu'
import MessageInstall, { message, useMessage, Message } from './message'
import ModalInstall, { Modal, useModal } from './modal'
import NotificationInstall, { notification, useNotification, Notification } from './notification'
import PaginationInstall, { Pagination } from './pagination'
import PopconfirmInstall, { Popconfirm } from './popconfirm'
import PopoverInstall, { Popover } from './popover'
import ProgressInstall, { Progress } from './progress'
import RadioInstall, { Radio, RadioGroup } from './radio'
import RangePickerInstall, { RangePicker } from './range-picker'
import RateInstall, { Rate } from './rate'
import ResultInstall, { Result } from './result'
import SegmentedInstall, { Segmented } from './segmented'
import SelectInstall, { Select } from './select'
import SkeletonInstall, { Skeleton } from './skeleton'
import SkeletonAvatarInstall, { SkeletonAvatar } from './skeleton-avatar'
import SkeletonButtonInstall, { SkeletonButton } from './skeleton-button'
import SkeletonImageInstall, { SkeletonImage } from './skeleton-image'
import SkeletonInputInstall, { SkeletonInput } from './skeleton-input'
import SkeletonNodeInstall, { SkeletonNode } from './skeleton-node'
import SliderInstall, { Slider } from './slider'
import SpaceInstall, { Space } from './space'
import SpaceCompactInstall, { SpaceCompact } from './space-compact'
import SpinInstall, { Spin } from './spin'
import SplitterInstall, { Panel, Splitter } from './splitter'
import StatisticInstall, { Statistic, StatisticCountdown } from './statistic'
import StatisticTimerInstall, { StatisticTimer } from './statistic-timer'
import StatusInstall, { Status } from './status'
import StepsInstall, { Steps } from './steps'
import SwitchInstall, { Switch } from './switch'
import TableInstall, { Table } from './table'
import TableColumnInstall, { TableColumn } from './table-column'
import TableColumnGroupInstall, { TableColumnGroup } from './table-column-group'
import TableSummaryInstall, { TableSummary } from './table-summary'
import TabsInstall, { Tab, Tabs } from './tabs'
import TagInstall, { Tag } from './tag'
import TextareaInstall, { Textarea } from './textarea'
import TimePickerInstall, { TimePicker } from './time-picker'
import TimelineInstall, { Timeline, TimelineItem } from './timeline'
import TooltipInstall, { Tooltip } from './tooltip'
import TourInstall, { Tour } from './tour'
import TransferInstall, { Transfer } from './transfer'
import TreeInstall, { Tree } from './tree'
import TreeSelectInstall, {
  TreeSelect,
  TREE_SELECT_SHOW_ALL,
  TREE_SELECT_SHOW_CHILD,
  TREE_SELECT_SHOW_PARENT,
} from './tree-select'
import TypographyInstall, { Link, Paragraph, Text, Title, Typography } from './typography'
import UploadInstall, { Upload } from './upload'
import UtilInstall, {
  canUseDom,
  clamp,
  classNames,
  contains,
  debounce,
  getOffset,
  inBrowser,
  isFunction,
  isNil,
  isObject,
  isVisible,
  noop,
  throttle,
} from './util'
import WatermarkInstall, { Watermark } from './watermark'

// 国际化语言包导出（cli 在 vue-ui 模板内静态注入；语言包文件不是组件、走单独路径）
export { zhCN, enUS, defaultLocale } from './locale'

const installs = [
  AffixInstall,
  AlertInstall,
  AnchorInstall,
  AutoCompleteInstall,
  AvatarInstall,
  AvatarGroupInstall,
  BadgeInstall,
  BadgeRibbonInstall,
  BreadcrumbInstall,
  ButtonInstall,
  Button3DInstall,
  CalendarInstall,
  CardInstall,
  CardMetaInstall,
  CarouselInstall,
  CascaderInstall,
  CheckBoxInstall,
  CheckableTagInstall,
  CollapseInstall,
  ColorPickerInstall,
  ConfigProviderInstall,
  DatePickerInstall,
  DescriptionsInstall,
  DirectoryTreeInstall,
  DividerInstall,
  DrawerInstall,
  DropdownInstall,
  DropdownButtonInstall,
  EmptyInstall,
  FlexInstall,
  FloatButtonInstall,
  FormInstall,
  GridInstall,
  IconInstall,
  ImageInstall,
  ImagePreviewGroupInstall,
  InputInstall,
  InputNumberInstall,
  InputOtpInstall,
  InputSearchInstall,
  LayoutInstall,
  MasonryInstall,
  MentionsInstall,
  MenuInstall,
  MessageInstall,
  ModalInstall,
  NotificationInstall,
  PaginationInstall,
  PopconfirmInstall,
  PopoverInstall,
  ProgressInstall,
  RadioInstall,
  RangePickerInstall,
  RateInstall,
  ResultInstall,
  SegmentedInstall,
  SelectInstall,
  SkeletonInstall,
  SkeletonAvatarInstall,
  SkeletonButtonInstall,
  SkeletonImageInstall,
  SkeletonInputInstall,
  SkeletonNodeInstall,
  SliderInstall,
  SpaceInstall,
  SpaceCompactInstall,
  SpinInstall,
  SplitterInstall,
  StatisticInstall,
  StatisticTimerInstall,
  StatusInstall,
  StepsInstall,
  SwitchInstall,
  TableInstall,
  TableColumnInstall,
  TableColumnGroupInstall,
  TableSummaryInstall,
  TabsInstall,
  TagInstall,
  TextareaInstall,
  TimePickerInstall,
  TimelineInstall,
  TooltipInstall,
  TourInstall,
  TransferInstall,
  TreeInstall,
  TreeSelectInstall,
  TypographyInstall,
  UploadInstall,
  UtilInstall,
  WatermarkInstall,
]

export {
  Affix,
  Alert,
  Anchor,
  AutoComplete,
  Avatar,
  AvatarGroup,
  avatarGroupInjectionKey,
  resolveAvatarSize,
  Badge,
  BadgeRibbon,
  isRibbonPresetColor,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonGroup,
  Button3d,
  Calendar,
  Card,
  CardMeta,
  Carousel,
  Cascader,
  CASCADER_SHOW_CHILD,
  CASCADER_SHOW_PARENT,
  CheckBox,
  CheckableTag,
  CheckableTagGroup,
  checkableTagGroupInjectionKey,
  Collapse,
  CollapseItem,
  ColorPicker,
  ConfigProvider,
  useConfig,
  DatePicker,
  Descriptions,
  DescriptionsItem,
  DirectoryTree,
  Divider,
  Drawer,
  Dropdown,
  DropdownButton,
  Empty,
  Flex,
  BackTop,
  FloatButton,
  Form,
  FormItem,
  FormList,
  FormProvider,
  Col,
  Row,
  addAPIProvider,
  addCollection,
  addIcon,
  loadIcon,
  loadIcons,
  clearIconRegistry,
  Icon,
  registerIcon,
  resolveIcon,
  unregisterIcon,
  Image,
  ImagePreviewGroup,
  Input,
  InputNumber,
  InputOtp,
  InputSearch,
  Content,
  Footer,
  Header,
  Layout,
  Sider,
  Masonry,
  Mentions,
  Menu,
  message,
  useMessage,
  Message,
  Modal,
  useModal,
  notification,
  useNotification,
  Notification,
  Pagination,
  Popconfirm,
  Popover,
  Progress,
  Radio,
  RadioGroup,
  RangePicker,
  Rate,
  Result,
  Segmented,
  Select,
  Skeleton,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonImage,
  SkeletonInput,
  SkeletonNode,
  Slider,
  Space,
  SpaceCompact,
  Spin,
  Panel,
  Splitter,
  Statistic,
  StatisticCountdown,
  StatisticTimer,
  Status,
  Steps,
  Switch,
  Table,
  TableColumn,
  TableColumnGroup,
  TableSummary,
  Tab,
  Tabs,
  Tag,
  Textarea,
  TimePicker,
  Timeline,
  TimelineItem,
  Tooltip,
  Tour,
  Transfer,
  Tree,
  TreeSelect,
  TREE_SELECT_SHOW_ALL,
  TREE_SELECT_SHOW_CHILD,
  TREE_SELECT_SHOW_PARENT,
  Link,
  Paragraph,
  Text,
  Title,
  Typography,
  Upload,
  canUseDom,
  clamp,
  classNames,
  contains,
  debounce,
  getOffset,
  inBrowser,
  isFunction,
  isNil,
  isObject,
  isVisible,
  noop,
  throttle,
  Watermark,
}

export default {
  version: '1.0.0',
  install(app: App): void {
    installs.forEach((p) => app.use(p))
  },
}
