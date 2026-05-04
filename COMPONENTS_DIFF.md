# vue3-ccui 与 Ant Design 组件对比清单

> 数据来源：[Ant Design 官方组件总览](https://ant.design/components/overview-cn) — 共 71 个官方组件（基于 v6.3.7）
>
> 现有组件：**33 个**（含本轮新增 14 个 + `button-3d` 这种非 Ant Design 标准组件）

## 一、已覆盖组件（30 / 71）

> 🆕 标记为本轮新增。

| ccui 组件         | Ant Design 名称        | 分类            |
| ----------------- | ---------------------- | --------------- |
| Button            | Button 按钮            | 通用            |
| Button3D          | —（项目特色组件）      | 通用            |
| Status            | Tag 标签（近似）       | 通用 / 数据展示 |
| **Typography** 🆕 | Typography 排版        | 通用            |
| Divider           | Divider 分割线         | 布局            |
| **Flex** 🆕       | Flex 弹性布局          | 布局            |
| **Space** 🆕      | Space 间距             | 布局            |
| **Breadcrumb** 🆕 | Breadcrumb 面包屑      | 导航            |
| Tabs              | Tabs 标签页            | 导航            |
| CheckBox          | Checkbox 多选框        | 数据录入        |
| Input             | Input 输入框           | 数据录入        |
| InputNumber       | InputNumber 数字输入框 | 数据录入        |
| Radio             | Radio 单选框           | 数据录入        |
| Rate              | Rate 评分              | 数据录入        |
| Slider            | Slider 滑动输入条      | 数据录入        |
| **Switch** 🆕     | Switch 开关            | 数据录入        |
| Avatar            | Avatar 头像            | 数据展示        |
| **Badge** 🆕      | Badge 徽标数           | 数据展示        |
| Calendar          | Calendar 日历          | 数据展示        |
| Card              | Card 卡片              | 数据展示        |
| **Empty** 🆕      | Empty 空状态           | 数据展示        |
| **Segmented** 🆕  | Segmented 分段控制器   | 数据展示        |
| **Tag** 🆕        | Tag 标签               | 数据展示        |
| Timeline          | Timeline 时间轴        | 数据展示        |
| Tree              | Tree 树形控件          | 数据展示        |
| **Alert** 🆕      | Alert 警告提示         | 反馈            |
| Popover           | Popover 气泡卡片       | 反馈            |
| **Progress** 🆕   | Progress 进度条        | 反馈            |
| **Result** 🆕     | Result 结果            | 反馈            |
| **Skeleton** 🆕   | Skeleton 骨架屏        | 反馈            |
| **Spin** 🆕       | Spin 加载中            | 反馈            |
| Tooltip           | Tooltip 文字提示       | 反馈            |

> 备注：Status 组件功能上接近 Ant Design 的 Tag，本轮新增 Tag 组件后，建议未来将 Status 视为 Tag 的别名或废弃。

## 二、缺失组件清单（41 项）按复杂度分级

分级标准：

- **简单**：纯展示或单一交互、无复杂状态机、无外部依赖、单文件即可完成（≈ 50–200 行）
- **中等**：需要管理状态、定位、动画、滚动监听或 Portal/Teleport
- **复杂**：嵌套数据结构、表单联动、虚拟列表、键盘交互、与日期/时间库深度耦合

### 🟢 简单组件（14 个）— ✅ 本轮已全部完成

| 组件                     | 分类     | 状态 | 说明                                          |
| ------------------------ | -------- | ---- | --------------------------------------------- |
| **Tag** 标签             | 数据展示 | ✅   | 进行标记和分类的小标签，支持多种预设色/可关闭 |
| **Badge** 徽标数         | 数据展示 | ✅   | 数字徽标 / 小红点，用于消息提醒               |
| **Space** 间距           | 布局     | ✅   | 设置组件之间的间距、对齐与方向                |
| **Flex** 弹性布局        | 布局     | ✅   | Flex 布局简易封装                             |
| **Typography** 排版      | 通用     | ✅   | 文本（Text/Title/Paragraph/Link）样式统一     |
| **Alert** 警告提示       | 反馈     | ✅   | 静态展示警告信息，可关闭、带图标              |
| **Empty** 空状态         | 数据展示 | ✅   | 通用的空状态占位组件                          |
| **Spin** 加载中          | 反馈     | ✅   | 用于页面/区块异步加载的旋转图标               |
| **Skeleton** 骨架屏      | 反馈     | ✅   | 加载占位的灰色块/圆/段落组合                  |
| **Progress** 进度条      | 反馈     | ✅   | 线条 / 圆形进度，支持多种状态                 |
| **Switch** 开关          | 数据录入 | ✅   | 二选一切换控件                                |
| **Segmented** 分段控制器 | 数据展示 | ✅   | 一组按钮组成的单选控件                        |
| **Result** 结果          | 反馈     | ✅   | 用于反馈一系列操作任务的处理结果              |
| **Breadcrumb** 面包屑    | 导航     | ✅   | 显示当前页面在系统层级中的位置                |

### 🟡 中等复杂度（22 个）— 已完成 18 / 22

| 组件                  | 分类     | 复杂点                         | 状态 |
| --------------------- | -------- | ------------------------------ | ---- |
| **Pagination** 分页       | 导航     | 页码计算、跳页输入             | ✅   |
| **Steps** 步骤条          | 导航     | 状态联动 + 横向/纵向           | ✅   |
| **Dropdown** 下拉菜单     | 导航     | 浮层定位 + 触发方式            | ✅   |
| **Menu** 导航菜单         | 导航     | 嵌套展开/折叠/SubMenu          | ✅   |
| **Anchor** 锚点           | 导航     | 滚动监听 + 高亮联动            | ✅   |
| **FloatButton** 悬浮按钮  | 通用     | 固定定位 + back-top 行为       | ✅   |
| **Affix** 固钉            | 其他     | 滚动监听 + sticky 兜底         | ✅   |
| **Statistic** 统计数值    | 数据展示 | 倒计时 + 数字动画              | ✅   |
| **Image** 图片            | 数据展示 | 预览模式 + 错误兜底            | ✅   |
| **List** 列表             | 数据展示 | 多种布局 + 加载更多            | ✅   |
| **Collapse** 折叠面板     | 数据展示 | 展开动画 + 受控/非受控         | ✅   |
| **Descriptions** 描述列表 | 数据展示 | 栅格行列布局                   | ✅   |
| **Watermark** 水印        | 数据展示 | Canvas 绘制 + DOM 防篡改       | ✅   |
| **Drawer** 抽屉           | 反馈     | Portal + 动画                  | ✅   |
| **Modal** 对话框          | 反馈     | Portal + 命令式 API + 焦点管理 | ✅   |
| **Message** 全局提示      | 反馈     | 命令式 API + 队列              | ✅   |
| **Notification** 通知     | 反馈     | 命令式 API + 多角落            | ✅   |
| **Popconfirm** 气泡确认   | 反馈     | 复用 Popover 的轻封装          | ✅   |
| Icon 图标             | 通用     | 需要建立 SVG 图标体系          | ⏳   |
| Carousel 走马灯       | 数据展示 | 自动播放 + 手势                | ⏳   |
| QRCode 二维码         | 数据展示 | 需引入二维码生成库             | ⏳   |
| ColorPicker 颜色      | 数据录入 | 色板 + HSV 转换                | ⏳   |

### 🔴 复杂组件（20 个）

| 组件              | 分类     | 复杂点                                          |
| ----------------- | -------- | ----------------------------------------------- |
| Form 表单         | 数据录入 | 字段管理 / 校验 / 联动 / 与所有录入组件耦合     |
| Table 表格        | 数据展示 | 排序 / 筛选 / 分组 / 固定列 / 可展开 / 虚拟滚动 |
| Select 选择器     | 数据录入 | 搜索 / 分组 / 多选 / 异步 / 虚拟列表            |
| AutoComplete      | 数据录入 | 与 Select 类似，且与 Input 紧耦合               |
| Cascader 级联     | 数据录入 | 多级联动 / 异步加载子节点                       |
| TreeSelect        | 数据录入 | Select + Tree 组合                              |
| Transfer 穿梭框   | 数据录入 | 双列管理 / 搜索 / 分页                          |
| Upload 上传       | 数据录入 | 拖拽 / 切片 / 进度 / 预览                       |
| Mentions 提及     | 数据录入 | contentEditable + 触发解析                      |
| DatePicker        | 数据录入 | 日历 / 范围 / 时间联动 / 国际化                 |
| TimePicker        | 数据录入 | 滚轮选择器                                      |
| Tour 漫游引导     | 数据展示 | 多步定位 + 蒙层裁切                             |
| Layout 布局       | 布局     | Header/Sider/Content/Footer 协同                |
| Grid 栅格         | 布局     | 24 栅格响应式 + Gutter                          |
| Splitter 分隔面板 | 布局     | 拖拽分割 + 嵌套                                 |
| Masonry 瀑布流    | 布局     | 多列重排 + 响应式                               |
| ConfigProvider    | 其他     | 全局配置注入 / 多语言 / 主题                    |
| App 包裹组件      | 其他     | 提供静态方法上下文                              |
| Util 工具类       | 其他     | 工具函数集合                                    |

---

## 三、本轮交付清单（已完成 ✅）

1. ✅ **主题 Token** 重构 `packages/theme/themes/light.ts` / `dark.ts`，按 Ant Design v6.3.7 SeedToken/MapToken 全量对齐
   - Primary: `#1677ff`、Success: `#52c41a`、Warning: `#faad14`、Error: `#ff4d4f`、Info: `#1677ff`（v6 与 v5 数值一致）
   - 圆角默认 `6px`、字号 `14px`/行高 `1.5714285714285714`
   - 文本/边框/背景/阴影/动效曲线全部对齐 Ant Design 默认主题
   - 新增 `color-border-disabled`（v6 新 Token）
   - CSS 变量同时挂载 `:root` + SCSS fallback 双轨（修复 JS/TSX 直接消费 `var()` 时无值回退黑色的问题）
2. ✅ **新增 14 个简单组件**（TSX + SCSS + ccui- 前缀，视觉复刻 Ant Design）
3. ✅ **Vitest 单测**（60 个新测试，全量 292/292 通过）
4. ✅ **VitePress 文档**（14 个组件 `index.md`，自动生成 sidebar）
5. ✅ **既有组件优化**（button、input、card、divider、status、avatar 已对齐 Ant Token）
6. ✅ **chrome-devtools-mcp 视觉抽查**（修复 Spin 圆点 base 类、Skeleton ul 项目符号、Result SVG var() 颜色、Breadcrumb 链接下划线、Space/Breadcrumb 分隔符颜色等问题）

## 四、Batch 2（复杂组件 · 零依赖）— ✅ 已完成

无前置依赖的复杂组件已全部交付（共 7 个）：

| 组件 | 分类 | 说明 |
|---|---|---|
| **Grid** Row/Col 栅格 🆕 | 布局 | 24 栅格 + 6 断点响应式 + Gutter |
| **Layout** 布局 🆕 | 布局 | Header/Sider/Content/Footer + Sider 折叠 |
| **Splitter** 分隔面板 🆕 | 布局 | 水平/垂直拖拽分割 + min/max 约束 |
| **Masonry** 瀑布流 🆕 | 布局 | 多列均匀分布 + 响应式列数 |
| **ConfigProvider** 全局配置 🆕 | 通用 | prefixCls / componentSize / direction / theme.token |
| **App** 包裹组件 🆕 | 通用 | 全局上下文（占位 message/notification/modal） |
| **Util** 工具集 🆕 | 通用 | classNames / debounce / throttle / clamp 等 |

测试覆盖：**369/369 全部通过**（含中等任务方并行合入的 Statistic 等）。

## 五、Batch 3（中等复杂度 · 主体）— ✅ 已完成 18 个

分三轮交付，全量 56 文件 / 409 测试通过：

**Round 1（6 个 / 30 测试）**：Pagination · Steps · Statistic · Collapse · Descriptions · Popconfirm
**Round 2（6 个 / 28 测试）**：Modal · Drawer · Dropdown · Message · Notification · Image
**Round 3（6 个 / 27 测试）**：Menu · Anchor · Affix · List · Watermark · FloatButton（含 BackTop）

关键工程决策：
- Modal/Drawer 使用 `Teleport` + `<Transition>`，Modal 通过 `document.body.dataset.ccuiModalCount` 计数器管理 scroll-lock
- Message/Notification 采用命令式 API（`createApp` 挂载 portal 容器，Notification 4 角落各一个 Map）
- Affix/Anchor 在 jsdom 下使用 `target === window` 引用相等替代 `instanceof Window`，并对 `getBoundingClientRect`/`scrollTo` 做 typeof 兜底
- Watermark MutationObserver 仅监听 `childList`（避免 attribute 变更触发自我递归 OOM），并对 canvas `getContext('2d')` try/catch 兜底返回 null fallback 样式
- Image 预览使用 `Teleport` + IntersectionObserver 懒加载

## 六、下一轮迭代建议

- 🟡 **中等复杂度剩余（4 个）**：Icon / Carousel / QRCode / ColorPicker
- 🔴 **复杂（13 个）**：Form / Table / Select / DatePicker / TimePicker / Cascader / TreeSelect / Transfer / Upload / AutoComplete / Mentions / Tour

> 优先级建议：先做 Form、Table、Select、DatePicker（高频核心）→ 再补 Icon 体系与 Carousel/ColorPicker。
