/**
 * Mapping table for @vaebe/ccui components.
 *
 * Each entry maps the in-template component name (`CButton`, `CFormItem`, ...)
 * to:
 * - `exportName`: the actual named export from `@vaebe/ccui` to be imported
 * - `styleDir`:   the kebab-case directory under `@vaebe/ccui/ui/<dir>` whose SCSS
 *                 file contains this component's styles. Sub-components share
 *                 their parent's directory (e.g. `CFormItem` → `form`).
 *
 * Synced with `packages/ccui/ui/vue-ccui.ts` exports.
 * Components only available imperatively (`message`, `notification`) are
 * intentionally excluded — those are not template components.
 */
export interface ComponentEntry {
  /** Named export from `@vaebe/ccui`. */
  exportName: string
  /** Kebab-case directory whose `<dir>.scss` provides this component's styles. */
  styleDir: string
  /**
   * Set to `false` for components that ship no `.scss` (e.g. `ConfigProvider`).
   * When `false`, `importStyle: 'scss'` mode skips side-effect style import to
   * avoid resolving a non-existent file.
   * @default true
   */
  hasStyle?: boolean
}

export const componentMap: Record<string, ComponentEntry> = {
  CAffix: { exportName: 'Affix', styleDir: 'affix' },
  CAlert: { exportName: 'Alert', styleDir: 'alert' },
  CAnchor: { exportName: 'Anchor', styleDir: 'anchor' },
  CAutoComplete: { exportName: 'AutoComplete', styleDir: 'auto-complete' },
  CAvatar: { exportName: 'Avatar', styleDir: 'avatar' },
  CAvatarGroup: { exportName: 'AvatarGroup', styleDir: 'avatar-group' },
  CBackTop: { exportName: 'BackTop', styleDir: 'float-button' },
  CBadge: { exportName: 'Badge', styleDir: 'badge' },
  CBadgeRibbon: { exportName: 'BadgeRibbon', styleDir: 'badge-ribbon' },
  CBorderBeam: { exportName: 'BorderBeam', styleDir: 'border-beam' },
  CBreadcrumb: { exportName: 'Breadcrumb', styleDir: 'breadcrumb' },
  CBreadcrumbItem: { exportName: 'BreadcrumbItem', styleDir: 'breadcrumb' },
  CButton: { exportName: 'Button', styleDir: 'button' },
  CButton3d: { exportName: 'Button3d', styleDir: 'button-3d' },
  CButtonGroup: { exportName: 'ButtonGroup', styleDir: 'button' },
  CCalendar: { exportName: 'Calendar', styleDir: 'calendar' },
  CCard: { exportName: 'Card', styleDir: 'card' },
  CCardMeta: { exportName: 'CardMeta', styleDir: 'card-meta' },
  CCarousel: { exportName: 'Carousel', styleDir: 'carousel' },
  CCascader: { exportName: 'Cascader', styleDir: 'cascader' },
  CCheckBox: { exportName: 'CheckBox', styleDir: 'check-box' },
  CCheckableTag: { exportName: 'CheckableTag', styleDir: 'checkable-tag' },
  CCheckableTagGroup: { exportName: 'CheckableTagGroup', styleDir: 'checkable-tag' },
  CCol: { exportName: 'Col', styleDir: 'grid' },
  CCollapse: { exportName: 'Collapse', styleDir: 'collapse' },
  CCollapseItem: { exportName: 'CollapseItem', styleDir: 'collapse' },
  CColorPicker: { exportName: 'ColorPicker', styleDir: 'color-picker' },
  CConfigProvider: { exportName: 'ConfigProvider', styleDir: 'config-provider', hasStyle: false },
  CDatePicker: { exportName: 'DatePicker', styleDir: 'date-picker' },
  CDescriptions: { exportName: 'Descriptions', styleDir: 'descriptions' },
  CDescriptionsItem: { exportName: 'DescriptionsItem', styleDir: 'descriptions' },
  CDivider: { exportName: 'Divider', styleDir: 'divider' },
  CDrawer: { exportName: 'Drawer', styleDir: 'drawer' },
  CDropdown: { exportName: 'Dropdown', styleDir: 'dropdown' },
  CEmpty: { exportName: 'Empty', styleDir: 'empty' },
  CFlex: { exportName: 'Flex', styleDir: 'flex' },
  CFloatButton: { exportName: 'FloatButton', styleDir: 'float-button' },
  CForm: { exportName: 'Form', styleDir: 'form' },
  CFormItem: { exportName: 'FormItem', styleDir: 'form' },
  CFormList: { exportName: 'FormList', styleDir: 'form' },
  CFormProvider: { exportName: 'FormProvider', styleDir: 'form' },
  CIcon: { exportName: 'Icon', styleDir: 'icon' },
  CImage: { exportName: 'Image', styleDir: 'image' },
  CImagePreviewGroup: { exportName: 'ImagePreviewGroup', styleDir: 'image-preview-group' },
  CInput: { exportName: 'Input', styleDir: 'input' },
  CInputNumber: { exportName: 'InputNumber', styleDir: 'input-number' },
  CInputOtp: { exportName: 'InputOtp', styleDir: 'input-otp' },
  CInputSearch: { exportName: 'InputSearch', styleDir: 'input-search' },
  CLayout: { exportName: 'Layout', styleDir: 'layout' },
  CLayoutContent: { exportName: 'Content', styleDir: 'layout' },
  CLayoutFooter: { exportName: 'Footer', styleDir: 'layout' },
  CLayoutHeader: { exportName: 'Header', styleDir: 'layout' },
  CLayoutSider: { exportName: 'Sider', styleDir: 'layout' },
  CMasonry: { exportName: 'Masonry', styleDir: 'masonry' },
  CMentions: { exportName: 'Mentions', styleDir: 'mentions' },
  CMenu: { exportName: 'Menu', styleDir: 'menu' },
  CModal: { exportName: 'Modal', styleDir: 'modal' },
  CPagination: { exportName: 'Pagination', styleDir: 'pagination' },
  CPopconfirm: { exportName: 'Popconfirm', styleDir: 'popconfirm' },
  CPopover: { exportName: 'Popover', styleDir: 'popover' },
  CProgress: { exportName: 'Progress', styleDir: 'progress' },
  CRadio: { exportName: 'Radio', styleDir: 'radio' },
  CRadioGroup: { exportName: 'RadioGroup', styleDir: 'radio' },
  CRangePicker: { exportName: 'RangePicker', styleDir: 'range-picker' },
  CRate: { exportName: 'Rate', styleDir: 'rate' },
  CResult: { exportName: 'Result', styleDir: 'result' },
  CRow: { exportName: 'Row', styleDir: 'grid' },
  CSegmented: { exportName: 'Segmented', styleDir: 'segmented' },
  CSelect: { exportName: 'Select', styleDir: 'select' },
  CSkeleton: { exportName: 'Skeleton', styleDir: 'skeleton' },
  CSkeletonNode: { exportName: 'SkeletonNode', styleDir: 'skeleton-node' },
  CSlider: { exportName: 'Slider', styleDir: 'slider' },
  CSpace: { exportName: 'Space', styleDir: 'space' },
  CSpaceCompact: { exportName: 'SpaceCompact', styleDir: 'space-compact' },
  CSpin: { exportName: 'Spin', styleDir: 'spin' },
  CSplitter: { exportName: 'Splitter', styleDir: 'splitter' },
  CSplitterPanel: { exportName: 'Panel', styleDir: 'splitter' },
  CStatus: { exportName: 'Status', styleDir: 'status' },
  CSteps: { exportName: 'Steps', styleDir: 'steps' },
  CSwitch: { exportName: 'Switch', styleDir: 'switch' },
  CTab: { exportName: 'Tab', styleDir: 'tabs' },
  CTable: { exportName: 'Table', styleDir: 'table' },
  CTableColumn: { exportName: 'TableColumn', styleDir: 'table' },
  CTableColumnGroup: { exportName: 'TableColumnGroup', styleDir: 'table' },
  CTableSummary: { exportName: 'TableSummary', styleDir: 'table' },
  CTabs: { exportName: 'Tabs', styleDir: 'tabs' },
  CTag: { exportName: 'Tag', styleDir: 'tag' },
  CTextarea: { exportName: 'Textarea', styleDir: 'textarea' },
  CTimePicker: { exportName: 'TimePicker', styleDir: 'time-picker' },
  CTimeRangePicker: { exportName: 'TimeRangePicker', styleDir: 'time-range-picker' },
  CTimeline: { exportName: 'Timeline', styleDir: 'timeline' },
  CTimelineItem: { exportName: 'TimelineItem', styleDir: 'timeline' },
  CTooltip: { exportName: 'Tooltip', styleDir: 'tooltip' },
  CTransfer: { exportName: 'Transfer', styleDir: 'transfer' },
  CTree: { exportName: 'Tree', styleDir: 'tree' },
  CTreeSelect: { exportName: 'TreeSelect', styleDir: 'tree-select' },
  CTypography: { exportName: 'Typography', styleDir: 'typography' },
  CTypographyLink: { exportName: 'Link', styleDir: 'typography' },
  CTypographyParagraph: { exportName: 'Paragraph', styleDir: 'typography' },
  CTypographyText: { exportName: 'Text', styleDir: 'typography' },
  CTypographyTitle: { exportName: 'Title', styleDir: 'typography' },
  CUpload: { exportName: 'Upload', styleDir: 'upload' },
  CUploadDragger: { exportName: 'UploadDragger', styleDir: 'upload-dragger' },
  CWatermark: { exportName: 'Watermark', styleDir: 'watermark' },
}

export const componentNames = Object.keys(componentMap)
