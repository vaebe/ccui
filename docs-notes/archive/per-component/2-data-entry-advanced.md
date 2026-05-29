# 数据录入复杂组件 vs Ant Design v6.3.7 完整 diff

> 范围：DatePicker / RangePicker / TimePicker / Form / Transfer / TreeSelect / Upload。维度：demo / props / events / 子组件。

---

## DatePicker

Ant 段 `## date-picker`（行 12431–14091）｜ccui types `packages/ccui/ui/date-picker/src/date-picker-types.ts`｜docs `packages/docs/components/date-picker/index.md`｜状态 `80%`（commit 7c41ff7→95%）

### Demo

**Ant 官方 demo（共 25 条）**：Basic / Range Picker / Multiple / Need Confirm / Switchable picker / Date Format / Choose Time / Mask Format / Limit Date Range / Disabled / Disabled Date & Time / Allow Empty / Select range dates / Preset Ranges / Extra Footer / Three Sizes / Customized Cell Rendering / Customize Panel / External use panel / Buddhist Era / Status / Variants / Custom semantic dom styling / Placement / Prefix and Suffix。

**ccui demo（11 条）**：基本用法 / 显示已选值 / 自定义格式 / 禁用日期 / 三种尺寸 / 禁用-不可清除 / 表单联动 / 弹层容器 / Picker 模式 / showTime / presets。

**ccui 缺失的 ant demo**：Multiple（无 multiple）；Need Confirm（无 needConfirm）；Switchable picker；Mask Format（format 不支持对象）；Limit Date Range（无 minDate/maxDate）；Disabled Date & Time（无顶层 disabledTime，仅 showTime 内部）；Customized Cell Rendering（无 cellRender）；Customize Panel（无 components）；External use panel（无 open/onOpenChange）；Buddhist Era（无 locale）；Status（types 有 docs 未演示）；Variants（无 variant）；Custom semantic dom styling（无 classNames/styles）；Prefix and Suffix（无 prefix/suffixIcon）。

**ccui 特有 demo**：「显示已选值」演示 valueFormat='string'|'date'|'number'（Ant 永远 Dayjs）；「禁用/不可清除」组合 disabled 与 clearable=false；「弹层容器」演示 popupAppendToBody/getPopupContainer 双轨。

### Props

**ccui 缺失的 ant props**：`allowClear` 对象形式（ccui clearable 无法定制 clearIcon）；`classNames`/`styles`；`cellRender`/`dateRender`；`components`；`defaultOpen`/`open`/`onOpenChange`；`disabledDate` 的 info(含 from/type)；`format` 对象/函数/数组（ccui 仅 string）；`order`/`preserveInvalidOnBlur`/`mode`；`locale`（仅 weekStart 简化版）；`minDate`/`maxDate`；`multiple`；`needConfirm`；`nextIcon`/`prevIcon`/`superNextIcon`/`superPrevIcon`；`pickerValue`/`defaultPickerValue`；`popupStyle`；`prefix`/`suffixIcon`；`previewValue`；`renderExtraFooter`/`panelRender`；`showWeek`；`variant`；`clearIcon`；`tagRender`（year/month/week/quarter multiple 用）；`onPanelChange`/`onOk`。

**命名/形状差异**：ccui `modelValue` ↔ ant `value/defaultValue`；ccui `clearable` ↔ ant `allowClear`；ccui `weekStart:0|1` ↔ ant dayjs locale.weekStart；ccui `size` 三档 default/large/small ↔ ant medium/large/small；ccui `inputReadOnly` 默认 true ↔ ant 默认 false；showTime 子字段 ccui `defaultValue` ↔ ant `defaultOpenValue`。ccui `presets.value` 已支持函数延迟求值，与 ant 5.8.0 对齐。

**ccui 特有 props**：`valueFormat`（v-model 输出形态）；`popupAppendToBody`；`transitionName`；`weekStart`。

### Events / 方法

**缺失 events**：`onOpenChange`/`onPanelChange`/`onOk`/`onFocus(e,info)`/`onBlur(e,info)`。**缺失 expose 方法**：`blur()`/`focus()`。

### 子组件 / 静态

**缺失**：`DatePicker.RangePicker` —— ccui 拆为独立 range-picker 包，无静态属性挂载。MonthPicker/WeekPicker/YearPicker/QuarterPicker 与 ant 同走 `picker` prop ✓。

---

## RangePicker

Ant 段 date-picker 内 RangePicker 子节（行 13874–13899 + 散落 demo）｜ccui types `packages/ccui/ui/range-picker/src/range-picker-types.ts`｜docs `packages/docs/components/range-picker/index.md`｜状态 `80%`（commit aada826→95%）

### Demo

**Ant 涉及 RangePicker 的 demo（13 条）**：Range Picker 基础(含 week/month/quarter/year + onFocus.range + id={{start,end}}) / Date Format / Choose Time / Disabled(含元组 [false,true]) / Disabled Date & Time(disabledTime 含 type) / Allow Empty / Select range dates(disabledDate.info) / Preset Ranges / Extra Footer / Three Sizes / Customized Cell Rendering / External use panel / Status-Variants-Placement-Prefix 含 RangePicker。

**ccui demo（12 条）**：基本用法 / 显示已选区间 / 自定义格式 / 自动调换 / 禁用日期 / 独立禁用起止侧 / 自定义分隔符与占位 / 三种尺寸 / 表单联动 / 弹层容器 / showTime / presets。

**ccui 缺失的 ant demo**：week/month/quarter/year 范围（无 picker prop）；Disabled 元组 [false,true]（disabled 只是 boolean）；Disabled Date & Time（showTime.disabledHours 无 side 上下文）；Allow Empty（无 allowEmpty）；Select range dates 动态范围（disabledStartDate/EndDate 缺 from/type 上下文）；Extra Footer（无 renderExtraFooter）；Customized Cell Rendering；External use panel（无 open/onOpenChange）；Status/Variants/Prefix/Suffix（无 variant/prefix/suffixIcon）；onFocus/onBlur 含 info.range；id={{start,end}} 双侧输入 id。

**ccui 特有 demo**：「自动调换」起止颠倒自动 swap；「独立禁用起止侧」disabledStartDate/disabledEndDate 拆开两函数；「自定义分隔符与占位」演示 separator: string。

### Props

**ccui 缺失的 ant props**：`allowEmpty:[boolean,boolean]`；`cellRender`；`defaultPickerValue`/`pickerValue`；`disabled:[boolean,boolean]`（ccui 仅 boolean）；`disabledTime(date,type,{from})`（ccui showTime.disabledHours 仅单函数）；`format` 数组/对象/函数；`id:{start?,end?}`；`picker`（week/month/quarter/year 范围）；`renderExtraFooter`；`separator:ReactNode`（ccui 仅 string）；showTime `defaultOpenValue:[Dayjs,Dayjs]`（ccui 改名 defaultStartTime/defaultEndTime）；通用：`open`/`minDate`/`maxDate`/`locale`/`mode`/`prefix`/`suffixIcon`/`variant`/`classNames`/`styles`/`components`。

**命名/形状差异**：ccui `modelValue` ↔ ant `value/defaultValue`；ccui `clearable` ↔ ant `allowClear`；ccui `disabledStartDate`/`disabledEndDate` ↔ ant 单一 `disabledDate(current,{from,type})`；ccui `showTime.defaultStartTime`/`defaultEndTime` ↔ ant `showTime.defaultOpenValue:[Dayjs,Dayjs]`；ccui `separator:string` ↔ ant `ReactNode`。

**ccui 特有 props**：`disabledStartDate`/`disabledEndDate`/`valueFormat`/`popupAppendToBody`/`transitionName`/`weekStart`。

### Events / 方法

**缺失 events**：`onCalendarChange(dates,dateStrings,{range})`/`onFocus(e,{range})`/`onBlur(e,{range})`/`onOpenChange`/`onPanelChange`/`onOk`。**缺失 expose 方法**：`blur()`/`focus()`。

### 子组件 / 静态

**缺失**：`DatePicker.RangePicker` 静态属性 —— ccui 独立 `<RangePicker>`，调用风格与 ant 不一致。

---

## TimePicker

Ant 段 `## time-picker`（行 51859–52473）｜ccui types `packages/ccui/ui/time-picker/src/time-picker-types.ts`｜docs `packages/docs/components/time-picker/index.md`｜状态 `80%`（commit d378fa4→95%）

### Demo

**Ant 官方 demo（15 条）**：Basic / Under Control / Three Sizes / Need Confirm / disabled / Hour and minute / interval option / Addon(renderExtraFooter) / 12 hours / Change on scroll / Time Range Picker(TimePicker.RangePicker) / Variants / Status / Prefix and Suffix / Custom semantic dom styling。

**ccui demo（12 条）**：基本用法 / 选中即提交 / 自定义格式 / 步长 / 屏蔽时间 / 隐藏某列 / 三种尺寸 / 表单联动 / 弹层容器 / 12 小时制 / 键盘导航 / 自动滚动到选中。

**ccui 缺失的 ant demo**：Under Control（v-model 等价但未单列）；Need Confirm（用 showOk 但语义/默认相反）；Addon（无 renderExtraFooter）；Change on scroll（无 changeOnScroll）；Time Range Picker（无 TimePicker.RangePicker）；Variants（无 variant）；Status（types 有 docs 未演示）；Prefix and Suffix（无 prefix/suffixIcon）；Custom semantic dom styling（无 classNames/styles）。

**ccui 特有 demo**：「选中即提交」showOk=false 等价 ant needConfirm=false；「屏蔽时间/隐藏某列」拆开 disabledHours 与 showHour/showMinute/showSecond；「键盘导航」「自动滚动到选中」ccui 强调交互。

### Props

**ccui 缺失的 ant props**：`allowClear` 对象形式（用 clearable）；`cellRender`；`changeOnScroll`；`classNames`/`styles`；`disabledTime` 统一钩子（ccui 拆为顶层 disabledHours/disabledMinutes/disabledSeconds 且不支持 disabledMilliseconds）；`hideDisabledOptions`（仅 showHour/showMinute/showSecond）；`needConfirm`（改名 showOk 默认相反 —— ccui 默认 true 需确定，ant 默认 false 即提交）；`open`；`prefix`/`suffixIcon`；`previewValue`；`renderExtraFooter`；`variant`；`onOpenChange`/`onCalendarChange`。RangePicker 子节 `disabledTime` 含 type 与 `order` —— ccui 完全无 TimePicker.RangePicker。

**命名/形状差异**：ccui `modelValue` ↔ ant `value/defaultValue`；ccui `clearable` ↔ ant `allowClear`；ccui `showOk` ↔ ant `needConfirm`（默认相反）；ccui `showHour`/`showMinute`/`showSecond` ↔ ant 用 format 字符串省略段（ant 无此 prop）；ccui `size` `default` ↔ ant `medium`；ccui `inputReadOnly` 默认 true ↔ ant 默认 false；ccui `nowText`/`okText` ↔ ant 走 locale。

**ccui 特有 props**：`showHour`/`showMinute`/`showSecond`/`showOk`/`nowText`/`okText`/`showNow`（与 ant 同名 ✓）/`valueFormat`/`popupAppendToBody`/`transitionName`/`autoFocus`。

### Events / 方法

**缺失 events**：`onOpenChange(open)`/`onCalendarChange`（仅 RangePicker）。**缺失 expose 方法**：`blur()`/`focus()`。

### 子组件 / 静态

**缺失**：`TimePicker.RangePicker` —— ccui 完全无时间范围选择器；ccui `<RangePicker>` 仅做日期范围。

---

## Form

Ant 段 `## form`（行 18579–22829）｜ccui types `packages/ccui/ui/form/src/form-types.ts`｜docs `packages/docs/components/form/index.md`｜状态 `95%`

### Demo

**Ant 官方 demo（36 条）**：Basic Usage / Form methods(useForm) / Form Layout / Form mix layout / Form disabled / Form variants / Required style(含函数) / Form size / label can wrap / No block rule(warningOnly) / Watch Hooks(useWatch+selector) / Validate Trigger(validateFirst/hasFeedback) / Validate Only / Path Prefix / Dynamic Form Item / Dynamic Form nest Items / Complex Dynamic Form Item(ErrorList+List rules) / Nest / complex form control / Customized Form Controls(valuePropName/trigger/getValueFromEvent/getValueProps) / Store Form Data into Upper Component(fields) / Control between forms / Inline Login Form / Login Form / Registration / Advanced search / Form in Modal / Time-related Controls / Handle Form Data Manually / Customized Validation(hasFeedback) / Dynamic Rules(Rule 函数) / Dependencies / getValueProps+normalize / Slide to error field / Other Form Controls / Custom semantic dom styling。

**ccui demo（8 条）**：基本用法 / 表单校验 / 初始值和依赖校验 / 动态字段 Form.List / 不同布局 / 实例方法 / 跨表单联动 Form.Provider / 字段保留策略 preserve。

**ccui 缺失的 ant demo**：Form methods（走 ref+model）；Form mix layout（Item 无 layout）；Form disabled（未单列 demo）；Form variants（无 variant）；Required style 自定义函数（requiredMark 不支持函数）；Form size（无顶层 size）；label can wrap（无 labelWrap/labelAlign）；No block rule（无 warningOnly）；Watch Hooks（无 useWatch）；Validate Trigger（无 validateFirst/hasFeedback）；Validate Only（不支持 validateOnly 选项）；Customized Form Controls（无 valuePropName/trigger/getValueFromEvent/getValueProps）；Store Form Data into Upper Component（无 fields prop）；complex form control / Inline Login Form 渲染函数子组件未覆盖；Time-related Controls 集中演示未覆盖；Customized Validation 含 hasFeedback；Dynamic Rules（Rule 不支持函数）；getValueProps+normalize（有 normalize 但 demo 未演示且无 getValueProps）；Slide to error field（有 prop/方法 ✓ 但未单列 demo）；Custom semantic dom styling（无 classNames/styles）；Complex Dynamic Form Item 含 ErrorList+List rules（无 Form.ErrorList，FormList 无 rules）。

**ccui 特有 demo**：「字段保留策略 preserve」单独成 demo（ant 仅 API 描述）；「跨表单联动」演示独立 FormProvider 组件（ant 是 Form.Provider 静态属性）。

### Props

**Form ccui 缺失的 ant props**：`classNames`/`styles`；`component`（false 不渲染 form 节点）；`fields`（FieldData[] 全字段受控）；`form`（FormInstance，ccui 走 ref）；`feedbackIcons`；`labelAlign`（'left'|'right' 水平对齐）；`labelWrap`；`labelCol`/`wrapperCol`（Grid 列，ccui 用 labelWidth）；`size`；`tooltip`；`variant`；`clearOnDestroy`；`onFieldsChange`/`onValuesChange`/`onFinish`/`onFinishFailed` 顶层 emit 形式缺失。

**FormItem ccui 缺失的 ant props**：`getValueFromEvent`；`getValueProps`；`hasFeedback`（含 icons）；`labelAlign`/`labelCol`/`wrapperCol`；`layout`（单 Item 覆盖）；`messageVariables`；`tooltip`；`trigger`；`validateFirst`（boolean|'parallel'）；`validateTrigger` Item 级（Rule 上有 trigger 但 Item 顶层缺失）；`valuePropName`（自定义控件值字段映射）。

**FormList ccui 缺失的 ant props**：`rules`（List 级校验 + ErrorList，4.7.0）。

**FormProvider**：ccui FormProviderContext 内部已 emit triggerFormChange/triggerFormFinish，但顶层组件是否 emit `formChange`/`formFinish` 需确认。

**Rule ccui 缺失的 ant 字段**：`defaultField`/`fields`（子规则）/`transform`/`warningOnly`。Rule 整体**不支持函数形式** `(form) => RuleConfig`。

**命名/形状差异**：ccui `model` 走外部状态绑定 ↔ ant `initialValues` 内部 store；ccui `labelWidth: string|number`（CSS 宽）↔ ant `labelCol={{span}}`（Grid 列）；ccui `labelPosition: 'left'|'right'|'top'` ↔ ant 两 prop（`labelAlign`+`layout:vertical=top`）；ccui FormProvider/FormList 是独立组件 ↔ ant `Form.Provider`/`Form.List` 静态属性。

**ccui 特有 props**：`validateOnRuleChange`（规则变化自动重验）；FormItem `validateDebounce`（与 ant 5.9.0 命名一致 ✓）；FormItem `normalize`/`dependencies`/`shouldUpdate`/`noStyle`/`hidden` 与 ant 同 ✓。

### Events / 方法

**缺失 events**：`onFieldsChange`/`onValuesChange`/`onFinish`/`onFinishFailed`（如未通过 emit 暴露）。

**缺失 expose 方法（FormInstance）**：`getFieldError`/`getFieldsError`/`getFieldValue`/`getFieldInstance`；`isFieldsTouched`/`isFieldTouched`/`isFieldValidating`；`setFields`/`setFieldValue`/`setFieldsValue`（走 model 双向）；`submit`。ccui 已有 ✓：`validate`/`validateField`/`resetFields`/`clearValidate`/`scrollToField`/`getFieldsValue`。

### 子组件 / 静态

**缺失**：`Form.useForm()` Hook（核心缺口，走 ref+model 双轨）；`Form.useFormInstance()`；`Form.useWatch(name, form)`（Vue 用 watch 替代但无 selector/preserve 语义）；`Form.Item.useStatus()`；`Form.ErrorList`（无法配 FormList rules 渲染错误列表）；`Form.List`/`Form.Provider` 静态挂载（ccui 仅以独立组件 FormList/FormProvider 交付，未挂在 Form 静态属性上）。

---

## Transfer

Ant 段 `## transfer`（行 54376–55462）｜ccui types `packages/ccui/ui/transfer/src/transfer-types.ts`｜docs `packages/docs/components/transfer/index.md`｜状态 `80%`

### Demo

**Ant 官方 demo（11 条）**：Basic / One Way(oneWay) / Search(showSearch+filterOption+onSearch) / Advanced(actions+footer+styles.section) / Custom datasource({label,value}) / Custom Actions(actions ReactNode[]) / Pagination / Table Transfer(children render props) / Tree Transfer(children render props) / Status / Custom semantic dom styling。

**ccui demo（6 条）**：基本用法 / 搜索 / 自定义渲染 / 禁用单项-整体 / 自定义文案 / （pagination 在 types 中但 docs 未单列）。

**ccui 缺失的 ant demo**：One Way（无 oneWay）；Advanced 含 footer/actions/styles.section（footer/actions 缺失，无 styles）；Custom datasource 含 {label,value}（render 类型不限但 demo 未覆盖）；Custom Actions（无 actions ReactNode[]）；Pagination 完整对象 demo（pagination 仅 boolean|number）；Table Transfer/Tree Transfer（无 children 函数 render props）；Status（无 status prop）；Custom semantic dom styling（无 classNames/styles）。

**ccui 特有 demo**：「禁用单项/整体」组合演示；「自定义文案」locale+titles+operations 拆细演示；「draggable」右侧拖拽排序（ant 内置无 draggable，用 itemRender+dnd-kit）。

### Props

**ccui 缺失的 ant props**：`actions:ReactNode[]`（6.0.0）；`classNames`/`styles`；`selectionsIcon`（5.8.0）；`footer(props,{direction})`；`oneWay`（4.3.0）；`pagination` 对象形式 `{pageSize,simple,showSizeChanger,showLessItems}`（ccui 仅 boolean|number）；`rowKey` 主键映射；`selectAllLabels`；`showSearch` 对象 `{placeholder,defaultValue}`（ccui 仅 boolean）；`showSelectAll`（ant 默认 true）；`status`（完全缺失）；`children` 作为 render props 接收 `{direction,disabled,filteredItems,selectedKeys,onItemSelect,onItemSelectAll}`（ccui 完全不支持函数 children，无法做 Table/Tree Transfer 集成）；`onScroll(direction,event)`；`onSearch` 含 direction（filterOption 也缺 direction 参数，5.9.0）；`operations`（已废弃，ccui 仍保留 [string,string] 旧 API）。

**命名/形状差异**：ccui `titles:[string,string]` ↔ ant `ReactNode[]`；ccui `operations:[string,string]` ↔ ant 已弃用建议改 actions；ccui `locale` 与 ant 一致 ✓；ccui `render:(item)=>unknown` ↔ ant `(record)=>ReactNode|{label,value}`；ccui `filterOption(input,item)` 缺 direction 参数。

**ccui 特有 props**：`draggable` —— 右侧列拖拽排序。

### Events / 方法

**缺失 events**：`onScroll(direction,e)`；`onSearch` 含 direction（如未带）。**缺失 expose 方法**：无明显约定。

### 子组件 / 静态

**缺失**：无静态子组件，但 ant 的 children render props 模式 ccui 完全缺失 —— 影响 Table Transfer/Tree Transfer 组合用法。

---

## TreeSelect

Ant 段 `## tree-select`（行 56658–57729）｜ccui types `packages/ccui/ui/tree-select/src/tree-select-types.ts`｜docs `packages/docs/components/tree-select/index.md`｜状态 `80%`

### Demo

**Ant 官方 demo（12 条）**：Basic / Multiple Selection / Generate from tree data / Checkable(treeCheckable+showCheckedStrategy) / Asynchronous loading(loadData+treeDataSimpleMode) / Show Tree Line(treeLine/treeIcon/showLeafIcon) / Placement / Variants / Status / Max Count(maxCount+showCheckedStrategy) / Prefix and Suffix / Custom semantic dom styling。

**ccui demo（8 条）**：单选 / 多选(默认 checkable) / treeCheckStrictly / 多选 selectable(无 checkbox) / 自定义字段名 fieldNames / 三种尺寸 / 表单联动 / 弹层容器。

**ccui 缺失的 ant demo**：Checkable 含 showCheckedStrategy（无 showCheckedStrategy prop，无 SHOW_ALL/SHOW_PARENT/SHOW_CHILD 常量）；Asynchronous loading（无 loadData/treeDataSimpleMode）；Show Tree Line（无 treeLine/treeIcon/switcherIcon）；Placement（有 prop 但 demo 未单列）；Variants（无 variant）；Status（types 有 docs 未单列）；Max Count（有 maxTagCount 默认 3，但**无 maxCount** 选中上限）；Prefix and Suffix（无 prefix/suffixIcon）；Custom semantic dom styling（无 classNames/styles）。

**ccui 特有 demo**：「多选 selectable（无 checkbox）」treeCheckable=false+multiple=true 走 c-tree multiple selectable；「自定义字段名 fieldNames」fieldNames 多了 disabled 字段（ant 只有 label/value/children）。

### Props

**ccui 缺失的 ant props**：`allowClear` 对象（用 clearable）；`autoClearSearchValue`；`classNames`/`styles`；`defaultOpen`/`open`；`popupMatchSelectWidth`；`popupRender`；`filterTreeNode`；`labelInValue`；`loadData(node)`；`maxCount`（5.23.0 选中上限）；`maxTagCount:'responsive'`（ccui 仅 number）；`maxTagPlaceholder`/`maxTagTextLength`；`prefix`/`suffixIcon`；`searchValue`/`onSearch`；`showCheckedStrategy`；`showSearch`（**types 未声明，docs demo 中却用了**）；`switcherIcon`；`tagRender`；`treeDataSimpleMode`；`treeTitleRender`；`treeExpandAction`/`treeExpandedKeys`/`treeIcon`/`treeLine`/`treeLoadedKeys`；`treeNodeFilterProp`/`treeNodeLabelProp`；`variant`；`virtual`；`onSelect`/`onTreeExpand`/`onPopupScroll`/`onOpenChange`。

**命名/形状差异**：ccui `modelValue` ↔ ant `value/defaultValue`；ccui `clearable` ↔ ant `allowClear`；ccui `popupMaxHeight:number`（默认 280）↔ ant `listHeight:number`（默认 256）；ccui `fieldNames:{label,value,children,disabled}` ↔ ant `{label,value,children}`（ccui 多 disabled）；ccui `notFoundContent:string` ↔ ant `ReactNode`；ccui `treeCheckable` 默认 true（multiple 时默认 checkbox） ↔ ant 默认 false。

**ccui 特有 props**：`popupMaxHeight`/`popupAppendToBody`/`transitionName`/`autoFocus`。

### Events / 方法

**缺失 events**：`onSelect(value,node,extra)`/`onTreeExpand(expandedKeys)`/`onSearch(value)`/`onPopupScroll(e)`/`onOpenChange(open)`。**缺失 expose 方法**：`blur()`/`focus()`。

### 子组件 / 静态

**缺失**：`TreeSelect.SHOW_ALL`/`TreeSelect.SHOW_PARENT`/`TreeSelect.SHOW_CHILD` 三个常量 —— 配合 showCheckedStrategy；ccui 该 prop 与常量均缺失。

---

## Upload

Ant 段 `## upload`（行 58573–60205）｜ccui types `packages/ccui/ui/upload/src/upload-types.ts`｜docs `packages/docs/components/upload/index.md`｜状态 `80%`

### Demo

**Ant 官方 demo（21 条）**：Upload by clicking / Avatar(picture-card/picture-circle) / Default Files / Pictures Wall / Pictures with picture-circle / Complete control over file list / Drag and Drop(Upload.Dragger) / Paste(pastable) / Upload directory / Upload manually / Upload png file only(Upload.LIST_IGNORE) / Pictures with list style / Customize preview file / Max Count / Transform file before request / Aliyun OSS / Custom action icon(showUploadList 对象) / Drag sorting(itemRender) / Crop image / Customize Progress Bar / Custom semantic dom styling。

**ccui demo（8 条）**：基本用法 / 拖拽上传 / 多选+类型限制 / 数量与大小限制 / 持续上传中状态 / 自定义触发器 / 自定义列表项 / 禁用。

**ccui 缺失的 ant demo**：Avatar（listType 仅 'text'|'picture'，缺 picture-card/picture-circle）；Default Files 多 status 混合（demo 未演示）；Pictures Wall（依赖 picture-card）；Pictures with picture-circle；Complete control over file list（demo 未演示截断+response url）；Drag and Drop（ccui 用 drag prop，无 Upload.Dragger 子组件）；Paste（无 pastable）；Upload directory（无 directory）；Upload png file only（无 Upload.LIST_IGNORE 常量）；Customize preview file（无 previewFile）；Transform file before request（BeforeUpload 不支持返回 File/Blob）；Aliyun OSS（无 data prop）；Custom action icon and extra info（showUploadList 仅 boolean）；Drag sorting（无 itemRender）；Customize Progress Bar（无 progress 配置）；Custom semantic dom styling（无 classNames/styles）。

**ccui 特有 demo**：「持续上传中状态」演示 defaultStatus='uploading'（ccui 特有 prop）；「自定义列表项」走 Vue 插槽（ant 用 itemRender）；「数量与大小限制」演示 maxSize（ant **无 maxSize**，走 beforeUpload）。

### Props

**ccui 缺失的 ant props**：`accept:AcceptObject`（ccui 仅 string）；`action:(file)=>Promise<string>`（仅 string）；`beforeUpload` 返回 `File/Blob/Upload.LIST_IGNORE`（ccui 仅 boolean/undefined/Promise）；`customRequest` 参数对象缺 `action/data/filename/withCredentials/headers/method`；`classNames`/`styles`；`data`；`directory`；`headers`；`iconRender`；`isImageUrl`；`itemRender`；`listType` 缺 'picture-card'/'picture-circle'；`method`；`name`（'file' 字段名）；`openFileDialogOnClick`；`pastable`（5.25.0）；`previewFile`；`progress`（ProgressProps）；`showUploadList` 对象形式 `{extra,showPreviewIcon,showDownloadIcon,showRemoveIcon,previewIcon,removeIcon,downloadIcon}`（ccui 仅 boolean）；`withCredentials`；`onDownload`/`onDrop`/`onPreview`/`onRemove:boolean|Promise`（阻止删除能力存疑）。

**命名/形状差异**：ccui `fileList` v-model ↔ ant `fileList`+onChange 受控；ccui `customRequest` 与 ant 同名 ✓ 但参数对象字段更少；ccui `drag:boolean` ↔ ant `<Upload.Dragger>` 子组件；ccui `removeText`/`triggerText`/`dragText` ↔ ant 走 locale/children。

**ccui 特有 props**：`maxSize`（单文件字节上限）；`defaultStatus`（'uploading'|'done'|'error'|'removed'）；`removeText`/`triggerText`/`dragText`（文案三件套）；`drag`（替代 Upload.Dragger 的开关）。

### Events / 方法

**缺失 events**：`onDrop(event)`/`onPreview(file)`/`onDownload(file)`/`onRemove(file):boolean|Promise<boolean>`（阻止移除能力）。**缺失 expose 方法**：无明显约定。

### 子组件 / 静态

**缺失**：`Upload.Dragger`（ccui 用 drag prop 替代）；`Upload.LIST_IGNORE` 静态常量（无法在 beforeUpload 返回该值丢弃文件不入列）。

### Types / 接口 缺失

`RcFile` —— ccui UploadFile 缺 `lastModifiedDate`/`crossOrigin`/`originFileObj` 字段（仅 raw）；`AcceptObject`（accept 仅 string）；`RequestOptions` —— ccui CustomRequestOptions 缺 action/data/filename/withCredentials/headers/method 字段。
