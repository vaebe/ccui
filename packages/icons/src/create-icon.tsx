import type { CSSProperties } from 'vue'
import type { CcuiIconComponent, IconBaseProps } from './types'

interface CreateIconOptions {
  name: string
  viewBox?: string
  path: string | string[]
}

function resolveSize(size: IconBaseProps['size']): string | undefined {
  if (size === undefined || size === null || size === '') return undefined
  return typeof size === 'number' ? `${size}px` : size
}

export function createIcon(options: CreateIconOptions): CcuiIconComponent {
  const { name, viewBox = '0 0 1024 1024', path } = options
  const paths = Array.isArray(path) ? path : [path]

  const Icon: CcuiIconComponent = (props) => {
    const size = resolveSize(props.size)
    const style: CSSProperties = {
      display: 'inline-flex',
      lineHeight: 0,
      verticalAlign: '-0.125em',
    }
    if (size) {
      style.fontSize = size
    }
    if (props.color) {
      style.color = props.color
    }
    const rotate = props.rotate
    if (rotate !== undefined && rotate !== '') {
      const deg = typeof rotate === 'number' ? `${rotate}deg` : rotate
      style.transform = `rotate(${deg})`
      style.transformOrigin = 'center'
    }

    const mergedStyle: CSSProperties = typeof props.style === 'string' ? style : { ...style, ...props.style }

    return (
      <span class={['ccui-icon', props.spin && 'ccui-icon--spin', props.class]} style={mergedStyle} aria-hidden="true">
        <svg viewBox={viewBox} width="1em" height="1em" fill="currentColor">
          {paths.map((d) => (
            <path d={d} />
          ))}
        </svg>
      </span>
    )
  }

  Icon.displayName = name
  Icon.props = ['size', 'color', 'rotate', 'spin', 'class', 'style'] as never
  return Icon
}
