import {
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
  type PropType,
  type ShallowRef,
} from 'vue'
import { JsonViewer as JsonViewerCore } from '@anil-labs/json-viewer-core'
import type {
  CopyEventPayload,
  JsonValue,
  JsonViewerOptions,
  ToggleEventPayload,
} from '@anil-labs/json-viewer-core'

/** Options for {@link useJsonViewer}, plus optional event callbacks. */
export interface UseJsonViewerOptions extends JsonViewerOptions {
  onToggle?: (payload: ToggleEventPayload) => void
  onCopy?: (payload: CopyEventPayload) => void
}

/**
 * Create and manage a {@link JsonViewerCore} instance; the viewer is built on
 * mount (so it is SSR-safe) and destroyed on scope unmount. Returns a ref to
 * the viewer — read `.el` or call `.mount(host)` to place it in the DOM.
 */
export function useJsonViewer(options: UseJsonViewerOptions): ShallowRef<JsonViewerCore | null> {
  const viewer = shallowRef<JsonViewerCore | null>(null)

  onMounted(() => {
    const v = new JsonViewerCore(options)
    if (options.onToggle) v.on('toggle', options.onToggle)
    if (options.onCopy) v.on('copy', options.onCopy)
    viewer.value = v
  })

  onBeforeUnmount(() => {
    viewer.value?.destroy()
    viewer.value = null
  })

  return viewer
}

/** An inline JSON tree viewer component. Renders a host `<div>` and mounts the viewer into it. */
export const JsonViewer = defineComponent({
  name: 'JsonViewer',
  props: {
    data: { type: null as unknown as PropType<JsonValue>, required: true },
    darkMode: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    expanded: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    rootControls: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    copyable: { type: Boolean as PropType<boolean | undefined>, default: undefined },
    className: { type: String as PropType<string | undefined>, default: undefined },
  },
  emits: {
    toggle: (payload: ToggleEventPayload) =>
      typeof payload.path === 'string' && typeof payload.expanded === 'boolean',
    copy: (payload: CopyEventPayload) => typeof payload.path === 'string',
  },
  setup(props, { emit }) {
    const host = ref<HTMLElement>()
    const viewer = useJsonViewer({
      data: props.data,
      darkMode: props.darkMode,
      expanded: props.expanded,
      rootControls: props.rootControls,
      copyable: props.copyable,
      className: props.className,
      onToggle: (p) => emit('toggle', p),
      onCopy: (p) => emit('copy', p),
    })

    onMounted(() => {
      if (host.value) viewer.value?.mount(host.value)
    })

    watch(
      () => props.data,
      (data) => viewer.value?.setData(data),
    )
    watch(
      () => props.darkMode,
      (darkMode) => {
        if (darkMode !== undefined) viewer.value?.setDarkMode(darkMode)
      },
    )
    watch(
      () => props.expanded,
      (expanded) => {
        if (expanded !== undefined) viewer.value?.setExpandedDefault(expanded)
      },
    )

    return () => h('div', { ref: host })
  },
})

export type {
  JsonValue,
  JsonViewerOptions,
  ToggleEventPayload,
  CopyEventPayload,
  JsonViewerEventMap,
  JsonViewerEventName,
} from '@anil-labs/json-viewer-core'
