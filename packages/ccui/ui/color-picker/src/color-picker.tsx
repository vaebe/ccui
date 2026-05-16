import type { Placement } from '@floating-ui/vue'
import type { CSSProperties, VNode } from 'vue'
import type { FormItemInjectedContext } from '../../form/src/form-types'
import type { HSV, RGB } from '../../shared/utils/color'
import type {
  ColorPickerPlacement,
  ColorPickerPresetColor,
  ColorPickerPresetGroup,
  ColorPickerProps,
} from './color-picker-types'
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
import {
  computed,
  defineComponent,
  inject,
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  Teleport,
  Transition,
  watch,
} from 'vue'
import { formItemInjectionKey } from '../../form/src/form-types'
import { renderIconNode } from '../../shared/hooks/use-icon'
import { useNamespace } from '../../shared/hooks/use-namespace'
import {
  DEFAULT_COLOR_HEX,
  hexToRgb,
  hsvToRgb,
  hsvToString,
  rgbToHex,
  rgbToHsv,
  rgbToString,
} from '../../shared/utils/color'
import { colorPickerProps } from './color-picker-types'
import './color-picker.scss'

const PLACEMENT_TO_FLOATING: Record<ColorPickerPlacement, Placement> = {
  bottomLeft: 'bottom-start',
  bottomRight: 'bottom-end',
  topLeft: 'top-start',
  topRight: 'top-end',
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0
  if (n < 0) return 0
  if (n > 1) return 1
  return n
}

export default defineComponent({
  name: 'CColorPicker',
  props: colorPickerProps,
  emits: ['update:modelValue', 'change', 'open-change'],
  setup(props: ColorPickerProps, { emit, slots }) {
    const ns = useNamespace('color-picker')
    const rootRef = ref<HTMLElement | null>(null)
    const popupRef = ref<HTMLElement | null>(null)
    const svAreaRef = ref<HTMLElement | null>(null)
    const hueAreaRef = ref<HTMLElement | null>(null)
    const alphaAreaRef = ref<HTMLElement | null>(null)
    const open = shallowRef(false)
    const innerValue = shallowRef<string>(props.defaultValue ?? DEFAULT_COLOR_HEX)
    const formItem = inject<FormItemInjectedContext | null>(formItemInjectionKey, null)

    const isControlled = computed(() => props.modelValue !== undefined)
    const currentHex = computed<string>(() => {
      const raw = isControlled.value ? props.modelValue : innerValue.value
      return raw ?? DEFAULT_COLOR_HEX
    })
    const currentRgb = computed<RGB>(() => hexToRgb(currentHex.value) ?? hexToRgb(DEFAULT_COLOR_HEX)!)
    // pending 状态供面板内部编辑使用
    const pendingHsv = shallowRef<HSV>(rgbToHsv(currentRgb.value))

    function syncPendingFromCurrent() {
      pendingHsv.value = rgbToHsv(currentRgb.value)
    }

    watch(currentHex, syncPendingFromCurrent)

    const placement = computed(() => PLACEMENT_TO_FLOATING[props.placement])
    const popupContainer = computed<HTMLElement | null>(() => {
      if (typeof document === 'undefined') return null
      if (props.getPopupContainer) return props.getPopupContainer(rootRef.value)
      if (props.popupAppendToBody) return document.body
      return null
    })
    const teleported = computed(() => popupContainer.value !== null)

    const { floatingStyles } = useFloating(rootRef, popupRef, {
      placement: placement as never,
      open,
      whileElementsMounted: autoUpdate,
      middleware: [offset(4), flip(), shift({ padding: 8 })],
      strategy: computed(() => (teleported.value ? 'fixed' : 'absolute')) as never,
    })

    const validationStatus = computed(() => formItem?.validateStatus.value ?? '')
    const mergedStatus = computed(() => props.status || validationStatus.value)

    function openPopup() {
      if (props.disabled || open.value) return
      syncPendingFromCurrent()
      open.value = true
      emit('open-change', true)
    }
    function closePopup() {
      if (!open.value) return
      open.value = false
      emit('open-change', false)
    }
    function togglePopup() {
      if (open.value) closePopup()
      else openPopup()
    }

    function emitChange(hsv: HSV) {
      const rgb = hsvToRgb(hsv)
      const hex = rgbToHex(rgb, props.disabledAlpha ? false : rgb.a < 1)
      if (!isControlled.value) {
        innerValue.value = hex
      }
      emit('update:modelValue', hex)
      emit('change', hex, { rgb, hsv })
      formItem?.validate('change')
    }

    function commitHsv(next: HSV) {
      pendingHsv.value = props.disabledAlpha ? { ...next, a: 1 } : next
      emitChange(pendingHsv.value)
    }

    function onClickOutside(e: MouseEvent) {
      if (!open.value) return
      const target = e.target as Node | null
      if (!target) return
      if (rootRef.value?.contains(target)) return
      if (popupRef.value?.contains(target)) return
      closePopup()
    }

    onMounted(() => {
      document.addEventListener('mousedown', onClickOutside, true)
    })
    onUnmounted(() => {
      document.removeEventListener('mousedown', onClickOutside, true)
    })

    // ---- 拖拽：通用 pointer 处理 ----
    function trackPointer(
      el: HTMLElement,
      e: PointerEvent,
      apply: (relX: number, relY: number, rect: DOMRect) => void,
    ) {
      const rect = el.getBoundingClientRect()
      function update(ev: PointerEvent) {
        const relX = clamp01((ev.clientX - rect.left) / Math.max(rect.width, 1))
        const relY = clamp01((ev.clientY - rect.top) / Math.max(rect.height, 1))
        apply(relX, relY, rect)
      }
      update(e)
      const move = (ev: PointerEvent) => update(ev)
      const up = () => {
        document.removeEventListener('pointermove', move)
        document.removeEventListener('pointerup', up)
      }
      document.addEventListener('pointermove', move)
      document.addEventListener('pointerup', up)
    }

    function onSvPointerDown(e: PointerEvent) {
      if (props.disabled || !svAreaRef.value) return
      trackPointer(svAreaRef.value, e, (relX, relY) => {
        const next: HSV = {
          h: pendingHsv.value.h,
          s: Math.round(relX * 100),
          v: Math.round((1 - relY) * 100),
          a: pendingHsv.value.a,
        }
        commitHsv(next)
      })
    }

    function onHuePointerDown(e: PointerEvent) {
      if (props.disabled || !hueAreaRef.value) return
      trackPointer(hueAreaRef.value, e, (relX) => {
        const next: HSV = {
          h: Math.round(relX * 360),
          s: pendingHsv.value.s,
          v: pendingHsv.value.v,
          a: pendingHsv.value.a,
        }
        commitHsv(next)
      })
    }

    function onAlphaPointerDown(e: PointerEvent) {
      if (props.disabled || props.disabledAlpha || !alphaAreaRef.value) return
      trackPointer(alphaAreaRef.value, e, (relX) => {
        const next: HSV = {
          h: pendingHsv.value.h,
          s: pendingHsv.value.s,
          v: pendingHsv.value.v,
          a: Math.round(relX * 100) / 100,
        }
        commitHsv(next)
      })
    }

    // ---- 键盘导航 ----
    function onSvKeydown(e: KeyboardEvent) {
      if (props.disabled) return
      const step = e.shiftKey ? 10 : 1
      let { s, v } = pendingHsv.value
      switch (e.key) {
        case 'ArrowRight':
          s = Math.min(100, s + step)
          break
        case 'ArrowLeft':
          s = Math.max(0, s - step)
          break
        case 'ArrowUp':
          v = Math.min(100, v + step)
          break
        case 'ArrowDown':
          v = Math.max(0, v - step)
          break
        default:
          return
      }
      e.preventDefault()
      commitHsv({ ...pendingHsv.value, s, v })
    }

    function onHueKeydown(e: KeyboardEvent) {
      if (props.disabled) return
      const step = e.shiftKey ? 10 : 1
      let { h } = pendingHsv.value
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          h = Math.min(360, h + step)
          break
        case 'ArrowLeft':
        case 'ArrowDown':
          h = Math.max(0, h - step)
          break
        default:
          return
      }
      e.preventDefault()
      commitHsv({ ...pendingHsv.value, h })
    }

    function onAlphaKeydown(e: KeyboardEvent) {
      if (props.disabled || props.disabledAlpha) return
      const step = e.shiftKey ? 0.1 : 0.01
      let { a } = pendingHsv.value
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          a = Math.min(1, +(a + step).toFixed(2))
          break
        case 'ArrowLeft':
        case 'ArrowDown':
          a = Math.max(0, +(a - step).toFixed(2))
          break
        default:
          return
      }
      e.preventDefault()
      commitHsv({ ...pendingHsv.value, a })
    }

    // ---- 清空 ----
    function handleClear(e: MouseEvent) {
      e.stopPropagation()
      if (!isControlled.value) {
        innerValue.value = DEFAULT_COLOR_HEX
      }
      emit('update:modelValue', null)
      emit('change', null, { rgb: null, hsv: null })
      formItem?.validate('change')
      closePopup()
    }

    // ---- hex 输入 ----
    const hexInput = ref('')
    watch(
      currentHex,
      (v) => {
        hexInput.value = (v || '').replace(/^#/, '').toUpperCase()
      },
      { immediate: true },
    )

    function onHexInput(e: Event) {
      hexInput.value = (e.target as HTMLInputElement).value.toUpperCase()
    }
    function onHexCommit() {
      const parsed = hexToRgb(`#${hexInput.value}`)
      if (parsed) {
        commitHsv(rgbToHsv(parsed))
      } else {
        // 解析失败时回滚显示
        hexInput.value = (currentHex.value || '').replace(/^#/, '').toUpperCase()
      }
    }
    function onHexKeydown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        onHexCommit()
        ;(e.target as HTMLInputElement).blur?.()
      }
    }

    // ---- preset 点击 ----
    function clickPreset(hex: string) {
      const parsed = hexToRgb(hex)
      if (!parsed) return
      commitHsv(rgbToHsv(parsed))
    }

    // ---- 显示文本 ----
    let warnedHsv = false
    const displayText = computed<string>(() => {
      const rgb = currentRgb.value
      if (props.format === 'rgb') return rgbToString(rgb)
      if (props.format === 'hsb') {
        // HSB 与 HSV 是同一色彩空间（不同命名），输出 `hsb(h, s%, b%)`
        const hsv = rgbToHsv(rgb)
        return `hsb(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`
      }
      if (props.format === 'hsv') {
        if (!warnedHsv && typeof console !== 'undefined') {
          console.warn(`[ccui][ColorPicker] format="hsv" 已 deprecated，请改用 "hsb"。`)
          warnedHsv = true
        }
        return hsvToString(rgbToHsv(rgb))
      }
      return rgbToHex(rgb, !props.disabledAlpha && rgb.a < 1).toUpperCase()
    })

    // ---- 渲染 ----
    function renderTrigger(): VNode {
      if (slots.trigger) {
        return (
          <div
            ref={(el: any) => (rootRef.value = el as HTMLElement)}
            class={[ns.e('trigger-custom'), props.classNames?.trigger]}
            style={props.styles?.trigger}
            onClick={togglePopup}
          >
            {slots.trigger({ color: currentHex.value, open: open.value, disabled: props.disabled })}
          </div>
        )
      }
      const swatchStyle: CSSProperties = {
        backgroundColor: rgbToString(currentRgb.value, true),
      }
      const triggerCls = [
        ns.e('trigger'),
        ns.em('size', props.size),
        props.disabled ? ns.is('disabled') : '',
        open.value ? ns.is('open') : '',
        mergedStatus.value ? ns.em('status', mergedStatus.value) : '',
      ]
      return (
        <button
          ref={(el: any) => (rootRef.value = el as HTMLElement)}
          type="button"
          class={[triggerCls, props.classNames?.trigger]}
          style={props.styles?.trigger}
          disabled={props.disabled}
          aria-haspopup="dialog"
          aria-expanded={open.value}
          onClick={togglePopup}
        >
          <span class={ns.e('swatch')}>
            <span class={ns.e('swatch-fg')} style={swatchStyle} />
          </span>
          {props.showText && <span class={ns.e('value-text')}>{displayText.value}</span>}
          {props.allowClear && !props.disabled && (
            <span class={ns.e('clear')} onClick={handleClear} role="button" aria-label="clear color">
              {slots.clearIcon ? slots.clearIcon() : (renderIconNode(props.clearIcon) ?? '×')}
            </span>
          )}
        </button>
      )
    }

    function renderSv(): VNode {
      const hue = pendingHsv.value.h
      const cursorStyle: CSSProperties = {
        left: `${pendingHsv.value.s}%`,
        top: `${100 - pendingHsv.value.v}%`,
      }
      const bgStyle: CSSProperties = { backgroundColor: `hsl(${hue}, 100%, 50%)` }
      return (
        <div
          ref={svAreaRef}
          class={ns.e('sv')}
          style={bgStyle}
          onPointerdown={onSvPointerDown}
          onKeydown={onSvKeydown}
          tabindex={0}
          role="application"
          aria-label="saturation and value"
        >
          <div class={ns.e('sv-saturation')} />
          <div class={ns.e('sv-value')} />
          <div class={ns.e('sv-cursor')} style={cursorStyle} />
        </div>
      )
    }

    function renderHue(): VNode {
      const cursorStyle: CSSProperties = { left: `${(pendingHsv.value.h / 360) * 100}%` }
      return (
        <div
          ref={hueAreaRef}
          class={ns.e('hue')}
          onPointerdown={onHuePointerDown}
          onKeydown={onHueKeydown}
          tabindex={0}
        >
          <div class={ns.e('hue-cursor')} style={cursorStyle} />
        </div>
      )
    }

    function renderAlpha(): VNode | null {
      if (props.disabledAlpha) return null
      const cursorStyle: CSSProperties = { left: `${pendingHsv.value.a * 100}%` }
      const baseRgb = hsvToRgb({ ...pendingHsv.value, a: 1 })
      const trackStyle: CSSProperties = {
        background: `linear-gradient(to right, ${rgbToString({ ...baseRgb, a: 0 }, true)}, ${rgbToString(baseRgb, false)})`,
      }
      return (
        <div
          ref={alphaAreaRef}
          class={ns.e('alpha')}
          onPointerdown={onAlphaPointerDown}
          onKeydown={onAlphaKeydown}
          tabindex={0}
        >
          <div class={ns.e('alpha-track')} style={trackStyle} />
          <div class={ns.e('alpha-cursor')} style={cursorStyle} />
        </div>
      )
    }

    function onRgbInput(channel: 'r' | 'g' | 'b', e: Event) {
      const raw = Number((e.target as HTMLInputElement).value)
      if (Number.isNaN(raw)) return
      const val = Math.max(0, Math.min(255, Math.round(raw)))
      const rgb = { ...hsvToRgb(pendingHsv.value), [channel]: val }
      commitHsv(rgbToHsv(rgb))
    }

    function renderInputs(): VNode {
      const rgb = hsvToRgb(pendingHsv.value)
      return (
        <div class={ns.e('inputs')}>
          <div class={ns.e('hex-wrap')}>
            <span class={ns.e('hash')}>#</span>
            <input
              class={ns.e('hex-input')}
              value={hexInput.value}
              maxlength={8}
              spellcheck={false}
              onInput={onHexInput}
              onBlur={onHexCommit}
              onKeydown={onHexKeydown}
              aria-label="hex"
            />
          </div>
          <div class={ns.e('rgb-inputs')}>
            {(['r', 'g', 'b'] as const).map((ch) => (
              <input
                key={ch}
                class={ns.e('rgb-input')}
                type="number"
                min={0}
                max={255}
                step={1}
                value={rgb[ch]}
                onInput={(e: Event) => onRgbInput(ch, e)}
                aria-label={ch.toUpperCase()}
              />
            ))}
          </div>
          {!props.disabledAlpha && (
            <div class={ns.e('alpha-input-wrap')}>
              <input
                class={ns.e('alpha-input')}
                type="number"
                min={0}
                max={100}
                step={1}
                value={Math.round(pendingHsv.value.a * 100)}
                onInput={(e: Event) => {
                  const raw = Number((e.target as HTMLInputElement).value)
                  if (Number.isNaN(raw)) return
                  const a = Math.max(0, Math.min(100, raw)) / 100
                  commitHsv({ ...pendingHsv.value, a })
                }}
                aria-label="alpha"
              />
              <span class={ns.e('alpha-suffix')}>%</span>
            </div>
          )}
        </div>
      )
    }

    // 解析 presets：兼容 string[] / 对象数组 / 分组数组三种形态，统一为 group 列表
    const normalizedPresets = computed<ColorPickerPresetGroup[]>(() => {
      const raw = props.presets
      if (!raw || raw.length === 0) return []
      // 整组形态：每项都是 { colors: [...] }
      const isGrouped = raw.every(
        (item) => item && typeof item === 'object' && Array.isArray((item as ColorPickerPresetGroup).colors),
      )
      if (isGrouped) {
        return raw as ColorPickerPresetGroup[]
      }
      // 扁平形态：string | { color, label? }
      return [{ colors: raw as ColorPickerPresetColor[] }]
    })

    function presetHex(item: ColorPickerPresetColor): string {
      return typeof item === 'string' ? item : item.color
    }
    function presetLabel(item: ColorPickerPresetColor): string {
      return typeof item === 'string' ? item : (item.label ?? item.color)
    }

    function renderPresets(): VNode | null {
      const groups = normalizedPresets.value
      if (groups.length === 0) return null
      return (
        <div class={ns.e('presets')}>
          {groups.map((group, gi) => (
            <div class={ns.e('preset-group')} key={group.label ?? `group-${gi}`}>
              {group.label && <div class={ns.e('preset-group-label')}>{group.label}</div>}
              <div class={ns.e('preset-group-colors')}>
                {group.colors.map((item) => {
                  const hex = presetHex(item)
                  return (
                    <button
                      key={hex}
                      type="button"
                      class={ns.e('preset')}
                      style={{ backgroundColor: hex }}
                      aria-label={presetLabel(item)}
                      title={presetLabel(item)}
                      onClick={() => clickPreset(hex)}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )
    }

    // 拾色器主体（SV / hue / alpha / 数值输入），不含 presets / footer
    function renderPicker(): VNode {
      return (
        <div class={ns.e('picker')}>
          {renderSv()}
          {renderHue()}
          {renderAlpha()}
          {renderInputs()}
        </div>
      )
    }

    // footer 槽位：默认面板无 footer，仅当用户传 footer slot 时渲染
    function renderFooter(): VNode | null {
      if (!slots.footer) return null
      return <div class={ns.e('footer')}>{slots.footer({ color: currentHex.value })}</div>
    }

    function renderPopup(): VNode | null {
      if (!open.value) return null
      const popupCls = [ns.e('panel'), props.popupClassName].filter(Boolean) as string[]
      const panelSlot = slots.panel
      const body = panelSlot
        ? panelSlot({
            color: currentHex.value,
            components: {
              picker: renderPicker,
              presets: renderPresets,
              footer: renderFooter,
            },
          })
        : [renderPresets(), renderPicker(), renderFooter()]
      return (
        <Teleport to={popupContainer.value as HTMLElement | null} disabled={!teleported.value}>
          <Transition name={props.transitionName} appear>
            <div
              ref={popupRef}
              class={[popupCls, props.classNames?.popup]}
              style={[floatingStyles.value, props.styles?.popup] as any}
            >
              {body}
            </div>
          </Transition>
        </Teleport>
      )
    }

    return () => (
      <div
        class={[
          ns.b(),
          props.disabled ? ns.is('disabled') : '',
          props.variant ? ns.m(`variant-${props.variant}`) : '',
          props.classNames?.root,
        ]}
        style={props.styles?.root}
      >
        {renderTrigger()}
        {renderPopup()}
      </div>
    )
  },
})
