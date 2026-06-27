<template>
  <div class="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300">
    <div v-if="loading" class="space-y-3">
      <div class="h-3 w-20 bg-gray-100 rounded-full animate-pulse" />
      <div class="h-8 w-24 bg-gray-100 rounded-full animate-pulse" />
    </div>
    <template v-else>
      <div class="flex items-center justify-between">
        <p class="text-xs font-medium text-gray-400 uppercase tracking-widest">{{ label }}</p>
        <div :class="iconBg" class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
          <component :is="svgIcon" :class="iconColor" class="w-[18px] h-[18px]" />
        </div>
      </div>
      <div>
        <p class="text-3xl font-bold text-gray-900 tracking-tight">{{ formattedValue }}</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'

const props = defineProps<{
  label: string
  value: number
  iconKey: 'users' | 'products' | 'events' | 'forum'
  loading?: boolean
}>()

// SVG icons by key
const icons = {
  users: defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.75',
      d: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' })
  ])}),
  products: defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.75',
      d: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z' })
  ])}),
  events: defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.75',
      d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' })
  ])}),
  forum: defineComponent({ render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.75',
      d: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' })
  ])}),
}

const palette = {
  users:    { bg: 'bg-blue-50',   color: 'text-blue-600' },
  products: { bg: 'bg-green-50',  color: 'text-green-700' },
  events:   { bg: 'bg-amber-50',  color: 'text-amber-600' },
  forum:    { bg: 'bg-violet-50', color: 'text-violet-600' },
}

const svgIcon  = computed(() => icons[props.iconKey])
const iconBg   = computed(() => palette[props.iconKey].bg)
const iconColor = computed(() => palette[props.iconKey].color)

const formattedValue = computed(() =>
  props.value >= 1000
    ? (props.value / 1000).toFixed(1) + 'k'
    : String(props.value)
)
</script>
