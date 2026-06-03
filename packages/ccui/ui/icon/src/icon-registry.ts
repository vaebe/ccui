import type { Component } from 'vue'

const iconRegistry = new Map<string, Component>()

function normalizeName(name: string) {
  return name.trim()
}

export function registerIcon(name: string, component: Component) {
  iconRegistry.set(normalizeName(name), component)
}

export function unregisterIcon(name: string) {
  iconRegistry.delete(normalizeName(name))
}

export function clearIconRegistry() {
  iconRegistry.clear()
}

export function resolveIcon(name?: string) {
  if (!name) {
    return undefined
  }
  return iconRegistry.get(normalizeName(name))
}
