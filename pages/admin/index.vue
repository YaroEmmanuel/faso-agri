<template>
  <AdminLayout>
    <div class="space-y-7">

      <!-- Header -->
      <div>
        <h1 class="text-xl font-bold text-gray-900">Tableau de bord</h1>
        <p class="text-sm text-gray-400 mt-0.5">Vue d'ensemble de la plateforme Faso Agri</p>
      </div>

      <!-- Stat Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          v-for="stat in stats"
          :key="stat.label"
          :label="stat.label"
          :value="stat.value"
          :icon-key="stat.iconKey"
          :loading="statsLoading"
        />
      </div>

      <!-- Recent publications table -->
      <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 class="text-sm font-semibold text-gray-900">Dernières publications</h2>
            <p class="text-xs text-gray-400 mt-0.5">5 publications récentes de la plateforme</p>
          </div>
          <NuxtLink
            to="/admin/publications"
            class="text-xs font-medium text-primary hover:underline underline-offset-2 transition"
          >
            Voir tout
          </NuxtLink>
        </div>

        <div v-if="recentLoading" class="divide-y divide-gray-50">
          <div v-for="i in 5" :key="i" class="px-6 py-4 flex items-center gap-4">
            <div class="h-3 w-3 rounded-full bg-gray-100 animate-pulse" />
            <div class="flex-1 h-3 bg-gray-100 rounded animate-pulse" />
            <div class="h-3 w-16 bg-gray-100 rounded animate-pulse" />
            <div class="h-5 w-20 bg-gray-100 rounded-full animate-pulse" />
          </div>
        </div>

        <div v-else class="divide-y divide-gray-50">
          <div
            v-for="item in recentItems"
            :key="item.id"
            class="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/60 transition"
          >
            <div :class="dotClass(item.type)" class="w-2 h-2 rounded-full flex-shrink-0" />
            <p class="flex-1 text-sm text-gray-700 font-medium truncate">{{ item.title }}</p>
            <span class="text-xs text-gray-400 flex-shrink-0 hidden sm:block">{{ item.date }}</span>
            <span :class="badgeClass(item.type)" class="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0">
              {{ item.typeLabel }}
            </span>
          </div>
          <div v-if="recentItems.length === 0" class="px-6 py-10 text-center text-sm text-gray-400">
            Aucune publication pour le moment.
          </div>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
const { $firestore } = useNuxtApp()

definePageMeta({ middleware: 'admin' })
useSeoMeta({ title: 'Tableau de bord — Admin Faso Agri' })

const statsLoading = ref(false)
const globalStats  = ref({ totalUsers: 0, totalProducts: 0, totalEvents: 0, totalForumTopics: 0 })

const stats = computed(() => [
  { label: 'Utilisateurs',    value: globalStats.value.totalUsers,       iconKey: 'users'    as const },
  { label: 'Produits',        value: globalStats.value.totalProducts,    iconKey: 'products' as const },
  { label: 'Événements',      value: globalStats.value.totalEvents,      iconKey: 'events'   as const },
  { label: 'Sujets du forum', value: globalStats.value.totalForumTopics, iconKey: 'forum'    as const },
])

const recentLoading = ref(false)
const recentItems   = ref<any[]>([])

const typeConfig: Record<string, { label: string; badge: string; dot: string }> = {
  news:         { label: 'Actualité', badge: 'bg-blue-50 text-blue-700',   dot: 'bg-blue-400' },
  advice:       { label: 'Conseil',   badge: 'bg-amber-50 text-amber-700', dot: 'bg-amber-400' },
  alert:        { label: 'Alerte',    badge: 'bg-red-50 text-red-600',     dot: 'bg-red-400' },
  announcement: { label: 'Annonce',   badge: 'bg-green-50 text-green-700', dot: 'bg-green-400' },
}

function badgeClass(type: string) { return typeConfig[type]?.badge ?? 'bg-gray-100 text-gray-500' }
function dotClass(type: string)   { return typeConfig[type]?.dot   ?? 'bg-gray-300' }

const fallbackStats = { totalUsers: 142, totalProducts: 87, totalEvents: 23, totalForumTopics: 56 }
const fallbackItems = [
  { id: '1', title: 'Récolte de mil en région du Sahel',                  type: 'news',         typeLabel: 'Actualité', date: '5 mai 2026' },
  { id: '2', title: 'Techniques d\'irrigation goutte-à-goutte',           type: 'advice',       typeLabel: 'Conseil',   date: '4 mai 2026' },
  { id: '3', title: 'Alerte criquet pèlerin — Nord du Burkina',           type: 'alert',        typeLabel: 'Alerte',    date: '3 mai 2026' },
  { id: '4', title: 'Vente groupée haricots verts — Bobo-Dioulasso',      type: 'announcement', typeLabel: 'Annonce',   date: '2 mai 2026' },
  { id: '5', title: 'Formation agropastorale — Koudougou',                type: 'news',         typeLabel: 'Actualité', date: '1 mai 2026' },
]

onMounted(async () => {
  if (!$firestore) {
    globalStats.value = fallbackStats
    recentItems.value = fallbackItems
    return
  }
  try {
    const { doc, getDoc, collection, query, orderBy, limit, getDocs } = await import('firebase/firestore')
    const fs = $firestore as any

    statsLoading.value  = true
    recentLoading.value = true

    const snap = await getDoc(doc(fs, 'stats', 'global'))
    if (snap.exists()) globalStats.value = snap.data() as any
    statsLoading.value = false

    const pubQ    = query(collection(fs, 'publications'), orderBy('createdAt', 'desc'), limit(5))
    const pubSnap = await getDocs(pubQ)
    recentItems.value = pubSnap.docs.map(d => {
      const data = d.data()
      const cfg  = typeConfig[data.type] ?? { label: data.type, badge: '', dot: '' }
      return {
        id: d.id, title: data.title, type: data.type, typeLabel: cfg.label,
        date: data.createdAt?.toDate().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) ?? '—',
      }
    })
    recentLoading.value = false
  } catch (e) {
    console.error(e)
    statsLoading.value  = false
    recentLoading.value = false
    globalStats.value = fallbackStats
    recentItems.value = fallbackItems
  }
})
</script>
