<template>
  <div class="min-h-screen bg-[#F8F9FB] flex">

    <!-- Sidebar -->
    <aside
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      class="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300"
    >
      <!-- Logo -->
      <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900 leading-none">Faso Agri</p>
            <p class="text-[10px] text-gray-400 mt-0.5">Administration</p>
          </div>
        </div>
        <button @click="sidebarOpen = false" class="lg:hidden text-gray-400 hover:text-gray-600 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-5 space-y-0.5">
        <p class="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Menu</p>
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group"
          :class="isActive(item.to)
            ? 'bg-primary text-white shadow-sm shadow-primary/20'
            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'"
        >
          <component :is="item.icon" class="w-[18px] h-[18px] flex-shrink-0" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- User footer -->
      <div class="px-4 py-4 border-t border-gray-100">
        <div class="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition group">
          <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
            {{ adminInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold text-gray-800 truncate">{{ adminName }}</p>
            <p class="text-[10px] text-gray-400 truncate">{{ adminEmail }}</p>
          </div>
          <button
            @click="handleSignOut"
            title="Déconnexion"
            class="text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Overlay mobile -->
    <div v-if="sidebarOpen" @click="sidebarOpen = false" class="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden" />

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0 lg:ml-64">

      <!-- Top bar -->
      <header class="bg-white border-b border-gray-100 px-5 py-3.5 flex items-center justify-between sticky top-0 z-10">
        <div class="flex items-center gap-3">
          <button @click="sidebarOpen = true" class="lg:hidden text-gray-500 hover:text-gray-800 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <div>
            <h1 class="text-sm font-semibold text-gray-900">{{ pageTitle }}</h1>
            <p class="text-xs text-gray-400 hidden sm:block">{{ pageDate }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs bg-green-50 text-green-700 font-medium px-2.5 py-1 rounded-full border border-green-100">
            Actif
          </span>
        </div>
      </header>

      <!-- Page slot -->
      <main class="flex-1 p-5 lg:p-7">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'

// ── SVG Icon components ──────────────────────────────────────────────────────
const IconDashboard = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.75',
      d: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z' })
  ])
})

const IconUsers = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.75',
      d: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' })
  ])
})

const IconCatalog = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.75',
      d: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2' })
  ])
})

const IconForum = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.75',
      d: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' })
  ])
})

const IconPublications = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.75',
      d: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2zM13 4v6h6M9 13h6M9 17h4' })
  ])
})

// ── State ────────────────────────────────────────────────────────────────────
const { $auth }    = useNuxtApp()
const router       = useRouter()
const currentRoute = useRoute()
const sidebarOpen  = ref(false)

const navItems = [
  { to: '/admin',              icon: IconDashboard,   label: 'Tableau de bord' },
  { to: '/admin/users',        icon: IconUsers,       label: 'Utilisateurs' },
  { to: '/admin/catalog',      icon: IconCatalog,     label: 'Catalogue' },
  { to: '/admin/forum',        icon: IconForum,       label: 'Forum' },
  { to: '/admin/publications', icon: IconPublications, label: 'Publications' },
]

function isActive(to: string) {
  if (to === '/admin') return currentRoute.path === '/admin'
  return currentRoute.path.startsWith(to)
}

// Page title based on active route
const pageTitle = computed(() => {
  const item = navItems.find(n => isActive(n.to))
  return item?.label ?? 'Administration'
})

const pageDate = computed(() =>
  new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
)

const auth = $auth as any
const adminName     = computed(() => auth?.currentUser?.displayName ?? 'Admin Démo')
const adminEmail    = computed(() => auth?.currentUser?.email ?? 'demo@fasoagri.bf')
const adminInitials = computed(() =>
  adminName.value.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
)

async function handleSignOut() {
  if (auth) {
    const { signOut } = await import('firebase/auth')
    await signOut(auth)
  }
  await router.push('/admin/login')
}
</script>
