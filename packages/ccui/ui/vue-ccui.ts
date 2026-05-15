import type { App } from 'vue'

import './shared/styles/base.scss'
export { zhCN, enUS, defaultLocale } from './locale'
import AffixInstall, { Affix } from './affix'
import AlertInstall, { Alert } from './alert'
import AnchorInstall, { Anchor } from './anchor'
import AutoCompleteInstall, { AutoComplete } from './auto-complete'
import AvatarInstall, { Avatar } from './avatar'
import AvatarGroupInstall, { AvatarGroup } from './avatar-group'
import BadgeInstall, { Badge } from './badge'
import BadgeRibbonInstall, { BadgeRibbon } from './badge-ribbon'
import BreadcrumbInstall, { Breadcrumb, BreadcrumbItem } from './breadcrumb'
import ButtonInstall, { Button, ButtonGroup } from './button'
import Button3DInstall, { Button3d } from './button-3d'
import CalendarInstall, { Calendar } from './calendar'
import CardInstall, { Card } from './card'
import CardGridInstall, { CardGrid } from './card-grid'
import CardMetaInstall, { CardMeta } from './card-meta'
import CarouselInstall, { Carousel } from './carousel'
import CascaderInstall, { Cascader } from './cascader'
import CheckableTagInstall, { CheckableTag, CheckableTagGroup } from './checkable-tag'
import CheckBoxInstall, { CheckBox } from './check-box'
import CollapseInstall, { Collapse, CollapseItem } from './collapse'
import ColorPickerInstall, { ColorPicker } from './color-picker'
import ConfigProviderInstall, { ConfigProvider, useConfig } from './config-provider'
import DatePickerInstall, { DatePicker } from './date-picker'
import DescriptionsInstall, { Descriptions, DescriptionsItem } from './descriptions'
import DividerInstall, { Divider } from './divider'
import DrawerInstall, { Drawer } from './drawer'
import DropdownInstall, { Dropdown } from './dropdown'
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
import ListInstall, { List, ListItem } from './list'
import MasonryInstall, { Masonry } from './masonry'
import MentionsInstall, { Mentions } from './mentions'
import MenuInstall, { Menu } from './menu'
import MessageInstall, { message, Message } from './message'
import ModalInstall, { Modal } from './modal'
import NotificationInstall, { notification, Notification } from './notification'
import PaginationInstall, { Pagination } from './pagination'
import PopconfirmInstall, { Popconfirm } from './popconfirm'
import PopoverInstall, { Popover } from './popover'
import ProgressInstall, { Progress } from './progress'
import QrCodeInstall, { QRCode } from './qr-code'
import RadioInstall, { Radio, RadioGroup } from './radio'
import RangePickerInstall, { RangePicker } from './range-picker'
import RateInstall, { Rate } from './rate'
import ResultInstall, { Result } from './result'
import SegmentedInstall, { Segmented } from './segmented'
import SelectInstall, { Select } from './select'
import SkeletonInstall, { Skeleton } from './skeleton'
import SliderInstall, { Slider } from './slider'
import SpaceInstall, { Space } from './space'
import SpinInstall, { Spin } from './spin'
import SplitterInstall, { Panel, Splitter } from './splitter'
import StatisticInstall, { Statistic, StatisticCountdown } from './statistic'
import StatusInstall, { Status } from './status'
import StepsInstall, { Steps } from './steps'
import SwitchInstall, { Switch } from './switch'
import TableInstall, { Table } from './table'
import TabsInstall, { Tab, Tabs } from './tabs'
import TagInstall, { Tag } from './tag'
import TextareaInstall, { Textarea } from './textarea'
import TimePickerInstall, { TimePicker } from './time-picker'
import TimelineInstall, { Timeline, TimelineItem } from './timeline'
import TooltipInstall, { Tooltip } from './tooltip'
import TourInstall, { Tour } from './tour'
import TransferInstall, { Transfer } from './transfer'
import TreeInstall, { Tree } from './tree'
import TreeSelectInstall, { TreeSelect } from './tree-select'
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
  CardGridInstall,
  CardMetaInstall,
  CarouselInstall,
  CascaderInstall,
  CheckableTagInstall,
  CheckBoxInstall,
  CollapseInstall,
  ColorPickerInstall,
  ConfigProviderInstall,
  DatePickerInstall,
  DescriptionsInstall,
  DividerInstall,
  DrawerInstall,
  DropdownInstall,
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
  ListInstall,
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
  QrCodeInstall,
  RadioInstall,
  RangePickerInstall,
  RateInstall,
  ResultInstall,
  SegmentedInstall,
  SelectInstall,
  SkeletonInstall,
  SliderInstall,
  SpaceInstall,
  SpinInstall,
  SplitterInstall,
  StatisticInstall,
  StatusInstall,
  StepsInstall,
  SwitchInstall,
  TableInstall,
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
  Badge,
  BadgeRibbon,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Button3d,
  ButtonGroup,
  Calendar,
  Card,
  CardGrid,
  CardMeta,
  Carousel,
  Cascader,
  CheckableTag,
  CheckableTagGroup,
  CheckBox,
  Collapse,
  CollapseItem,
  ColorPicker,
  ConfigProvider,
  useConfig,
  DatePicker,
  Descriptions,
  DescriptionsItem,
  Divider,
  Drawer,
  Dropdown,
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
  List,
  ListItem,
  Masonry,
  Mentions,
  Menu,
  message,
  Message,
  Modal,
  notification,
  Notification,
  Pagination,
  Popconfirm,
  Popover,
  Progress,
  QRCode,
  Radio,
  RadioGroup,
  RangePicker,
  Rate,
  Result,
  Segmented,
  Select,
  Skeleton,
  Slider,
  Space,
  Spin,
  Panel,
  Splitter,
  Statistic,
  StatisticCountdown,
  Status,
  Steps,
  Switch,
  Table,
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
  version: '1.0.8',
  install(app: App): void {
    installs.forEach((p) => app.use(p))
  },
}
