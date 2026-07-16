import type { ToggleEventPayload, CopyEventPayload } from './types'

/** Events emitted by a {@link JsonViewer}, with their argument tuples. */
export interface JsonViewerEventMap {
  /** A node was expanded or collapsed. */
  toggle: [payload: ToggleEventPayload]
  /** A node's value was copied to the clipboard. */
  copy: [payload: CopyEventPayload]
}

export type JsonViewerEventName = keyof JsonViewerEventMap

type Listener<E extends JsonViewerEventName> = (...args: JsonViewerEventMap[E]) => void
type AnyListener = (...args: never[]) => void

/** A tiny, fully-typed event emitter. */
export class Emitter {
  private readonly listeners = new Map<JsonViewerEventName, Set<AnyListener>>()

  /** Subscribe to an event. Returns an unsubscribe function. */
  on<E extends JsonViewerEventName>(event: E, listener: Listener<E>): () => void {
    let set = this.listeners.get(event)
    if (!set) {
      set = new Set()
      this.listeners.set(event, set)
    }
    set.add(listener as unknown as AnyListener)
    return () => this.off(event, listener)
  }

  /** Unsubscribe a previously-registered listener. */
  off<E extends JsonViewerEventName>(event: E, listener: Listener<E>): void {
    this.listeners.get(event)?.delete(listener as unknown as AnyListener)
  }

  /** Emit an event to all subscribers, isolating a throwing listener. */
  emit<E extends JsonViewerEventName>(event: E, ...args: JsonViewerEventMap[E]): void {
    const set = this.listeners.get(event)
    if (!set) return
    for (const listener of [...set]) {
      try {
        ;(listener as unknown as Listener<E>)(...args)
      } catch (err) {
        if (typeof console !== 'undefined') console.error('[json-viewer] event handler threw:', err)
      }
    }
  }

  /** Drop every listener. */
  clear(): void {
    this.listeners.clear()
  }
}
