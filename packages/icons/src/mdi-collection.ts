import type { IconifyJSON } from '@iconify/vue'
import { addCollection } from '@iconify/vue'
import alertCircle from '@iconify-icons/mdi/alert-circle'
import arrowUp from '@iconify-icons/mdi/arrow-up'
import calendarOutline from '@iconify-icons/mdi/calendar-outline'
import check from '@iconify-icons/mdi/check'
import checkCircle from '@iconify-icons/mdi/check-circle'
import chevronRight from '@iconify-icons/mdi/chevron-right'
import clockOutline from '@iconify-icons/mdi/clock-outline'
import close from '@iconify-icons/mdi/close'
import closeCircle from '@iconify-icons/mdi/close-circle'
import contentCopy from '@iconify-icons/mdi/content-copy'
import loading from '@iconify-icons/mdi/loading'
import magnify from '@iconify-icons/mdi/magnify'
import menuDown from '@iconify-icons/mdi/menu-down'
import menuRight from '@iconify-icons/mdi/menu-right'

/**
 * ccui 组件运行时使用的 mdi 图标，SVG 数据 inline 进包，无需联网。
 * 新增组件用到新 mdi 图标时，在此清单同步加 import + key。
 */
export const ccuiMdiCollection: IconifyJSON = {
  prefix: 'mdi',
  icons: {
    'alert-circle': alertCircle,
    'arrow-up': arrowUp,
    'calendar-outline': calendarOutline,
    check: check,
    'check-circle': checkCircle,
    'chevron-right': chevronRight,
    'clock-outline': clockOutline,
    close: close,
    'close-circle': closeCircle,
    'content-copy': contentCopy,
    loading: loading,
    magnify: magnify,
    'menu-down': menuDown,
    'menu-right': menuRight,
  } as IconifyJSON['icons'],
}

let installed = false

/**
 * 把 ccui 内置 mdi 图标注册到 Iconify 本地数据源。
 * 调用后 `<c-icon name="mdi:check" />` 等内置图标直接命中本地，
 * 不再去 api.iconify.design 拉数据，内网 / 无网环境也能正确渲染。幂等。
 */
export function installCcuiMdiIcons(): void {
  if (installed) return
  addCollection(ccuiMdiCollection)
  installed = true
}
