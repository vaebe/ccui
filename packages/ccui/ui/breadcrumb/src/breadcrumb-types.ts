import type { ExtractPropTypes, PropType } from 'vue'

export interface BreadcrumbRoute {
  path?: string
  href?: string
  title?: string
  breadcrumbName?: string
}

export const breadcrumbProps = {
  separator: {
    type: String,
    default: '/',
  },
  routes: {
    type: Array as PropType<BreadcrumbRoute[]>,
    default: () => [],
  },
} as const

export const breadcrumbItemProps = {
  href: {
    type: String,
    default: '',
  },
  separator: {
    type: String,
    default: '',
  },
} as const

export type BreadcrumbProps = ExtractPropTypes<typeof breadcrumbProps>
export type BreadcrumbItemProps = ExtractPropTypes<typeof breadcrumbItemProps>
