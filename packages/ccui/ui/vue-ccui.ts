import type { App } from 'vue'

import AffixInstall, { Affix } from './affix'
import AlertInstall, { Alert } from './alert'
import AnchorInstall, { Anchor } from './anchor'
import AvatarInstall, { Avatar } from './avatar'
import BadgeInstall, { Badge } from './badge'
import BreadcrumbInstall, { Breadcrumb, BreadcrumbItem } from './breadcrumb'
import ButtonInstall, { Button } from './button'
import Button3DInstall, { Button3d } from './button-3d'
import CalendarInstall, { Calendar } from './calendar'
import CardInstall, { Card } from './card'
import CheckBoxInstall, { CheckBox } from './check-box'
import CollapseInstall, { Collapse, CollapseItem } from './collapse'
import ConfigProviderInstall, { ConfigProvider, useConfig } from './config-provider'
import DescriptionsInstall, { Descriptions, DescriptionsItem } from './descriptions'
import DividerInstall, { Divider } from './divider'
import DrawerInstall, { Drawer } from './drawer'
import DropdownInstall, { Dropdown } from './dropdown'
import EmptyInstall, { Empty } from './empty'
import FlexInstall, { Flex } from './flex'
import FloatButtonInstall, { BackTop, FloatButton } from './float-button'
import FormInstall, { Form, FormItem, FormList, FormProvider } from './form'
import GridInstall, { Col, Row } from './grid'
import IconInstall, { clearIconRegistry, Icon, registerIcon, resolveIcon, unregisterIcon } from './icon'
import ImageInstall, { Image } from './image'
import InputInstall, { Input } from './input'
import InputNumberInstall, { InputNumber } from './input-number'
import LayoutInstall, { Content, Footer, Header, Layout, Sider } from './layout'
import ListInstall, { List, ListItem } from './list'
import MasonryInstall, { Masonry } from './masonry'
import MenuInstall, { Menu } from './menu'
import MessageInstall, { message, Message } from './message'
import ModalInstall, { Modal } from './modal'
import NotificationInstall, { notification, Notification } from './notification'
import PaginationInstall, { Pagination } from './pagination'
import PopconfirmInstall, { Popconfirm } from './popconfirm'
import PopoverInstall, { Popover } from './popover'
import ProgressInstall, { Progress } from './progress'
import RadioInstall, { Radio, RadioGroup } from './radio'
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
import TabsInstall, { Tab, Tabs } from './tabs'
import TableInstall, { Table } from './table'
import TagInstall, { Tag } from './tag'
import TimelineInstall, { Timeline, TimelineItem } from './timeline'
import TooltipInstall, { Tooltip } from './tooltip'
import TreeInstall, { Tree } from './tree'
import TypographyInstall, { Link, Paragraph, Text, Title, Typography } from './typography'
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
  AvatarInstall,
  BadgeInstall,
  BreadcrumbInstall,
  ButtonInstall,
  Button3DInstall,
  CalendarInstall,
  CardInstall,
  CheckBoxInstall,
  CollapseInstall,
  ConfigProviderInstall,
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
  InputInstall,
  InputNumberInstall,
  LayoutInstall,
  ListInstall,
  MasonryInstall,
  MenuInstall,
  MessageInstall,
  ModalInstall,
  NotificationInstall,
  PaginationInstall,
  PopconfirmInstall,
  PopoverInstall,
  ProgressInstall,
  RadioInstall,
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
  TabsInstall,
  TableInstall,
  TagInstall,
  TimelineInstall,
  TooltipInstall,
  TreeInstall,
  TypographyInstall,
  UtilInstall,
  WatermarkInstall,
]

export {
  Affix,
  Alert,
  Anchor,
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Button3d,
  Calendar,
  Card,
  CheckBox,
  Collapse,
  CollapseItem,
  ConfigProvider,
  useConfig,
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
  clearIconRegistry,
  Icon,
  registerIcon,
  resolveIcon,
  unregisterIcon,
  Image,
  Input,
  InputNumber,
  Content,
  Footer,
  Header,
  Layout,
  Sider,
  List,
  ListItem,
  Masonry,
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
  Radio,
  RadioGroup,
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
  Tab,
  Tabs,
  Table,
  Tag,
  Timeline,
  TimelineItem,
  Tooltip,
  Tree,
  Link,
  Paragraph,
  Text,
  Title,
  Typography,
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
