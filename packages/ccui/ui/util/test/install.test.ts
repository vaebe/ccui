import { describe, expect, it, vi } from 'vitest'
import * as Affix from '../../affix'
import * as Alert from '../../alert'
import * as Anchor from '../../anchor'
import * as Avatar from '../../avatar'
import * as Badge from '../../badge'
import * as Breadcrumb from '../../breadcrumb'
import * as Button from '../../button'
import * as Calendar from '../../calendar'
import * as Card from '../../card'
import * as CheckBox from '../../check-box'
import * as Collapse from '../../collapse'
import * as ConfigProvider from '../../config-provider'
import * as Descriptions from '../../descriptions'
import * as Divider from '../../divider'
import * as Drawer from '../../drawer'
import * as Dropdown from '../../dropdown'
import * as Empty from '../../empty'
import * as Flex from '../../flex'
import * as FloatButton from '../../float-button'
import * as Form from '../../form'
import * as Grid from '../../grid'
import * as Icon from '../../icon'
import * as Image from '../../image'
import * as Input from '../../input'
import * as InputNumber from '../../input-number'
import * as Layout from '../../layout'
import * as Masonry from '../../masonry'
import * as Menu from '../../menu'
import * as Message from '../../message'
import * as Modal from '../../modal'
import * as Notification from '../../notification'
import * as Pagination from '../../pagination'
import * as Popconfirm from '../../popconfirm'
import * as Popover from '../../popover'
import * as Progress from '../../progress'
import * as Radio from '../../radio'
import * as Rate from '../../rate'
import * as Result from '../../result'
import * as Segmented from '../../segmented'
import * as Select from '../../select'
import * as Skeleton from '../../skeleton'
import * as Slider from '../../slider'
import * as Space from '../../space'
import * as Spin from '../../spin'
import * as Splitter from '../../splitter'
import * as Statistic from '../../statistic'
import * as Status from '../../status'
import * as Steps from '../../steps'
import * as Switch from '../../switch'
import * as Table from '../../table'
import * as Tabs from '../../tabs'
import * as Tag from '../../tag'
import * as Timeline from '../../timeline'
import * as Tooltip from '../../tooltip'
import * as Typography from '../../typography'
import * as Util from '../../util'
import * as Watermark from '../../watermark'

const modules = [
  Affix,
  Alert,
  Anchor,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Calendar,
  Card,
  CheckBox,
  Collapse,
  ConfigProvider,
  Descriptions,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  Flex,
  FloatButton,
  Form,
  Grid,
  Icon,
  Image,
  Input,
  InputNumber,
  Layout,
  Masonry,
  Menu,
  Message,
  Modal,
  Notification,
  Pagination,
  Popconfirm,
  Popover,
  Progress,
  Radio,
  Rate,
  Result,
  Segmented,
  Select,
  Skeleton,
  Slider,
  Space,
  Spin,
  Splitter,
  Statistic,
  Status,
  Steps,
  Switch,
  Table,
  Tabs,
  Tag,
  Timeline,
  Tooltip,
  Typography,
  Util,
  Watermark,
]

describe('component install entries', () => {
  it('registers exported install hooks', () => {
    const app = {
      component: vi.fn(),
      config: {
        globalProperties: {},
      },
    }
    const installed = new Set<Function>()

    modules.forEach((module) => {
      Object.values(module).forEach((entry) => {
        const install = (entry as { install?: Function })?.install
        if (typeof install === 'function' && !installed.has(install)) {
          installed.add(install)
          install(app)
        }
      })
    })

    expect(app.component).toHaveBeenCalled()
    expect(app.config.globalProperties).toHaveProperty('$message')
    expect(app.config.globalProperties).toHaveProperty('$notification')
  })
})
