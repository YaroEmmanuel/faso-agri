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

      <!-- Publications par catégorie -->
      <div class="space-y-5">
        <div
          v-for="section in sections"
          :key="section.key"
          class="bg-white rounded-2xl border border-gray-100/75 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.012)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.035)] hover:-translate-y-0.5 transition-all duration-300"
        >
          <div class="px-6 py-4.5 bg-gray-50/40 border-b border-gray-100/80 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-gray-800">{{ section.label }}</h2>
            <NuxtLink :to="section.link" class="text-xs font-medium text-primary hover:text-primary/80 hover:underline underline-offset-4 transition">
              Voir tout
            </NuxtLink>
          </div>

          <!-- Skeleton -->
          <div v-if="recentLoading" class="divide-y divide-gray-50">
            <div v-for="i in 3" :key="i" class="px-6 py-3.5 flex items-center gap-4">
              <div class="flex-1 h-3 bg-gray-100 rounded animate-pulse" />
              <div class="h-3 w-24 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>

          <!-- Items -->
          <div v-else class="divide-y divide-gray-50">
            <button
              v-for="item in section.items"
              :key="item.id"
              @click="openDetail(item, section.key)"
              class="w-full px-6 py-3.5 flex items-center gap-3 hover:bg-gray-50/70 transition group text-left"
            >
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-800 font-medium truncate group-hover:text-primary transition">{{ item.title }}</p>
                <p class="text-xs text-gray-400 mt-0.5">{{ item.sub }}</p>
              </div>
              <span class="text-xs text-gray-400 flex-shrink-0 hidden sm:block">{{ item.date }}</span>
              <svg class="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>

            <div v-if="section.items.length === 0" class="px-6 py-8 text-center text-sm text-gray-400">
              Aucun élément pour le moment.
            </div>
          </div>
        </div>
      </div>

      <!-- Error banner -->
      <div v-if="loadError" class="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
        <svg class="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        </svg>
        <div>
          <p class="text-sm font-medium text-amber-800">Connexion Firestore partielle</p>
          <p class="text-xs text-amber-600 mt-0.5">{{ loadError }}</p>
        </div>
      </div>

    </div>

    <!-- ── Drawer de détail ────────────────────────────────────────────── -->
    <Teleport to="body">
      <!-- Overlay -->
      <Transition name="fade">
        <div
          v-if="drawer.open"
          class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          @click="drawer.open = false"
        />
      </Transition>

      <!-- Panneau latéral -->
      <Transition name="slide">
        <div
          v-if="drawer.open"
          class="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col"
        >
          <!-- En-tête du drawer -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
            <div>
              <p class="text-xs font-semibold text-primary uppercase tracking-wide">{{ drawer.sourceLabel }}</p>
              <h2 class="text-base font-bold text-gray-900 mt-0.5 line-clamp-2">{{ drawer.data?.title ?? drawer.data?.name ?? '(Sans titre)' }}</h2>
            </div>
            <button @click="drawer.open = false" class="ml-4 p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition flex-shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Contenu scrollable -->
          <div class="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            <!-- Chargement -->
            <div v-if="drawer.loading" class="space-y-3">
              <div v-for="i in 4" :key="i" class="h-3 bg-gray-100 rounded animate-pulse" />
            </div>

            <template v-else-if="drawer.data">

              <!-- Méta-infos communes -->
              <div class="flex flex-wrap gap-2 text-xs">
                <span v-if="drawer.data.category" class="px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">
                  {{ drawer.data.category }}
                </span>
                <span v-if="drawer.data.type" class="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                  {{ drawer.data.type }}
                </span>
                <span v-if="drawer.data.status" class="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                  {{ statusLabel(drawer.data.status) }}
                </span>
                <span v-if="drawer.data.isPinned || drawer.data.status === 'pinned'" class="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  Épinglé
                </span>
                <span v-if="drawer.data.reported" class="px-2.5 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
                  Signalé
                </span>
              </div>

              <!-- Auteur / Date / Province -->
              <div class="text-xs text-gray-500 space-y-1">
                <p v-if="drawer.data.author || drawer.data.authorName">
                  <span class="font-medium">Auteur :</span> {{ drawer.data.author || drawer.data.authorName }}
                </p>
                <p v-if="drawer.data.province || drawer.data.location">
                  <span class="font-medium">Localisation :</span> {{ drawer.data.province || drawer.data.location }}
                </p>
                <p v-if="drawer.data.price">
                  <span class="font-medium">Prix :</span> {{ drawer.data.price }} FCFA
                </p>
                <p v-if="drawer.data.readMinutes">
                  <span class="font-medium">Temps de lecture :</span> {{ drawer.data.readMinutes }} min
                </p>
                <p v-if="drawer.data.replies ?? drawer.data.replyCount">
                  <span class="font-medium">Réponses :</span> {{ drawer.data.replies ?? drawer.data.replyCount }}
                </p>
                <p>
                  <span class="font-medium">Date :</span> {{ formatTs(drawer.data.createdAt) }}
                </p>
              </div>

              <!-- Tags (Infos Pratiques) -->
              <div v-if="drawer.data.tags?.length" class="flex flex-wrap gap-1.5">
                <span v-for="tag in drawer.data.tags" :key="tag" class="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                  #{{ tag }}
                </span>
              </div>

              <!-- Description courte -->
              <div v-if="drawer.data.description">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Description</p>
                <p class="text-sm text-gray-700 italic">{{ drawer.data.description }}</p>
              </div>

              <!-- Contenu principal -->
              <div v-if="drawer.data.content || drawer.data.body || drawer.data.content">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Contenu</p>
                <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{{ drawer.data.content || drawer.data.body }}</p>
              </div>

              <!-- Réponses du forum -->
              <div v-if="drawer.key === 'discussions' && drawer.replies.length > 0">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Réponses ({{ drawer.replies.length }})</p>
                <div class="space-y-3">
                  <div v-for="reply in drawer.replies" :key="reply.id" class="bg-gray-50 rounded-xl p-3">
                    <p class="text-xs font-medium text-gray-500 mb-1">{{ reply.authorName ?? 'Anonyme' }} · {{ formatTs(reply.createdAt) }}</p>
                    <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ reply.content ?? '—' }}</p>
                  </div>
                </div>
              </div>

            </template>
          </div>

          <!-- Actions en bas -->
          <div class="flex items-center gap-2 px-6 py-4 border-t border-gray-100 flex-shrink-0">
            <NuxtLink :to="drawer.sectionLink" class="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">
              Voir la section
            </NuxtLink>
            <div class="flex-1" />
            <button
              v-if="drawer.key === 'discussions'"
              @click="toggleClose"
              class="px-3 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
            >
              {{ drawer.data?.status === 'closed' ? 'Rouvrir' : 'Fermer' }}
            </button>
            <button
              @click="deleteDrawerItem"
              class="px-3 py-2 text-sm border border-red-200 rounded-xl text-red-500 hover:bg-red-50 transition"
            >
              Supprimer
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

  </AdminLayout>
</template>

<script setup lang="ts">
const { $firestore } = useNuxtApp()

definePageMeta({ middleware: 'admin' })
useSeoMeta({ title: 'Tableau de bord — Admin Faso Agri' })

const statsLoading  = ref(false)
const recentLoading = ref(false)
const loadError     = ref('')

const globalStats      = ref({ totalUsers: 0, totalProducts: 0, totalEvents: 0, totalForumTopics: 0 })
const rawPractical     = ref<any[]>([])
const rawDiscussions   = ref<any[]>([])
const rawProducts      = ref<any[]>([])
const rawAnnouncements = ref<any[]>([])

const stats = computed(() => [
  { label: 'Utilisateurs',    value: globalStats.value.totalUsers,       iconKey: 'users'    as const },
  { label: 'Marché agricole', value: globalStats.value.totalProducts,    iconKey: 'products' as const },
  { label: 'Événements',      value: globalStats.value.totalEvents,      iconKey: 'events'   as const },
  { label: 'Sujets du forum', value: globalStats.value.totalForumTopics, iconKey: 'forum'    as const },
])

function formatTs(ts: any): string {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function statusLabel(s: string) {
  const m: Record<string,string> = { active: 'Actif', published: 'Publié', draft: 'Brouillon', archived: 'Archivé', inactive: 'Inactif', open: 'Ouvert', closed: 'Fermé', pinned: 'Épinglé' }
  return m[s] ?? s
}

const SECTION_CONFIG: Record<string, { label: string; link: string; collections: string[] }> = {
  practical_infos: { label: 'Infos Pratiques', link: '/admin/publications', collections: ['practical_infos'] },
  discussions:     { label: 'Forum',            link: '/admin/forum',        collections: ['discussions'] },
  products:        { label: 'Marché agricole',  link: '/admin/catalog',      collections: ['products'] },
  announcements:   { label: 'Événements',       link: '/admin/catalog',      collections: ['announcements'] },
}

const sections = computed(() => [
  {
    key: 'practical_infos', label: 'Infos Pratiques', link: '/admin/publications',
    items: rawPractical.value.slice(0, 3).map((d: any) => ({
      id: d.id,
      title: d.title ?? '(Sans titre)',
      sub: [d.category, d.author].filter(Boolean).join(' · ') || '—',
      date: formatTs(d.createdAt),
    })),
  },
  {
    key: 'discussions', label: 'Forum', link: '/admin/forum',
    items: rawDiscussions.value.slice(0, 3).map((d: any) => ({
      id: d.id,
      title: d.title ?? d.content ?? '(Sans titre)',
      sub: d.authorName ?? 'Anonyme',
      date: formatTs(d.createdAt),
    })),
  },
  {
    key: 'products', label: 'Marché agricole', link: '/admin/catalog',
    items: rawProducts.value.slice(0, 3).map((d: any) => ({
      id: d.id,
      title: d.title ?? d.name ?? '(Sans titre)',
      sub: [d.category, d.province].filter(Boolean).join(' · ') || '—',
      date: formatTs(d.createdAt),
    })),
  },
  {
    key: 'announcements', label: 'Événements', link: '/admin/catalog',
    items: rawAnnouncements.value.slice(0, 3).map((d: any) => ({
      id: d.id,
      title: d.title ?? '(Sans titre)',
      sub: [d.type, d.province].filter(Boolean).join(' · ') || '—',
      date: formatTs(d.createdAt),
    })),
  },
])

// ── Drawer ─────────────────────────────────────────────────────────────────
const drawer = reactive({
  open: false,
  loading: false,
  key: '',
  sourceLabel: '',
  sectionLink: '',
  data: null as any,
  replies: [] as any[],
})

async function openDetail(item: { id: string }, sectionKey: string) {
  const cfg = SECTION_CONFIG[sectionKey]
  drawer.key         = sectionKey
  drawer.sourceLabel = cfg?.label ?? sectionKey
  drawer.sectionLink = cfg?.link ?? '/admin'
  drawer.data        = null
  drawer.replies     = []
  drawer.open        = true
  drawer.loading     = true

  try {
    if (!$firestore) return
    const { doc, getDoc, collection, query, orderBy, getDocs } = await import('firebase/firestore')
    const fs = $firestore as any

    // Charger le document
    for (const col of cfg.collections) {
      try {
        const snap = await getDoc(doc(fs, col, item.id))
        if (snap.exists()) {
          drawer.data = { id: snap.id, ...snap.data() }
          break
        }
      } catch { /* essayer la suivante */ }
    }

    // Charger les réponses si c'est une discussion
    if (sectionKey === 'discussions' && drawer.data) {
      try {
        const repSnap = await getDocs(
          query(collection(fs, 'discussions', item.id, 'replies'), orderBy('createdAt', 'asc'))
        )
        drawer.replies = repSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }))
      } catch { /* sous-collection absente */ }
    }
  } catch (e: any) {
    console.error('[Drawer]', e)
  } finally {
    drawer.loading = false
  }
}

async function toggleClose() {
  if (!drawer.data) return
  const newStatus = drawer.data.status === 'closed' ? 'open' : 'closed'
  if ($firestore) {
    const { doc, updateDoc } = await import('firebase/firestore')
    await updateDoc(doc($firestore as any, 'discussions', drawer.data.id), { status: newStatus })
  }
  drawer.data.status = newStatus
}

async function deleteDrawerItem() {
  if (!drawer.data || !confirm('Supprimer cet élément définitivement ?')) return
  const cfg = SECTION_CONFIG[drawer.key]
  try {
    if ($firestore) {
      const { doc, deleteDoc } = await import('firebase/firestore')
      for (const col of cfg.collections) {
        try { await deleteDoc(doc($firestore as any, col, drawer.data.id)); break } catch { /* */ }
      }
    }
    // Retirer de la liste locale
    if (drawer.key === 'practical_infos') rawPractical.value     = rawPractical.value.filter((d: any) => d.id !== drawer.data.id)
    if (drawer.key === 'discussions')     rawDiscussions.value   = rawDiscussions.value.filter((d: any) => d.id !== drawer.data.id)
    if (drawer.key === 'products')        rawProducts.value      = rawProducts.value.filter((d: any) => d.id !== drawer.data.id)
    if (drawer.key === 'announcements')   rawAnnouncements.value = rawAnnouncements.value.filter((d: any) => d.id !== drawer.data.id)
    drawer.open = false
  } catch (e: any) {
    alert('Erreur : ' + (e.message ?? 'inconnue'))
  }
}

// ── Chargement initial ─────────────────────────────────────────────────────
onMounted(async () => {
  if (!$firestore) { loadError.value = 'Firebase non configuré — données indisponibles.'; return }

  const fs = $firestore as any
  const { collection, query, orderBy, limit, getDocs, getCountFromServer, doc, getDoc } = await import('firebase/firestore')

  statsLoading.value = true
  try {
    const statsSnap = await getDoc(doc(fs, 'stats', 'global'))
    if (statsSnap.exists()) {
      globalStats.value = statsSnap.data() as any
    } else {
      const [u, p, e, t] = await Promise.all([
        getCountFromServer(collection(fs, 'users')),
        getCountFromServer(collection(fs, 'products')),
        getCountFromServer(collection(fs, 'announcements')),
        getCountFromServer(collection(fs, 'discussions')),
      ])
      globalStats.value = { totalUsers: u.data().count, totalProducts: p.data().count, totalEvents: e.data().count, totalForumTopics: t.data().count }
    }
  } catch (e: any) {
    loadError.value = e?.message ?? 'Erreur stats.'
  } finally {
    statsLoading.value = false
  }

  recentLoading.value = true
  const safeQ = async (col: string) => {
    try {
      const snap = await getDocs(query(collection(fs, col), orderBy('createdAt', 'desc'), limit(3)))
      return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }))
    } catch {
      try {
        const snap = await getDocs(collection(fs, col))
        return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }))
          .sort((a: any, b: any) => (b.createdAt?.toDate?.()?.getTime() ?? 0) - (a.createdAt?.toDate?.()?.getTime() ?? 0))
          .slice(0, 3)
      } catch { return [] }
    }
  }

  try {
    const [p, d, pr, an] = await Promise.all([
      safeQ('practical_infos'), safeQ('discussions'), safeQ('products'), safeQ('announcements'),
    ])
    rawPractical.value     = p
    rawDiscussions.value   = d
    rawProducts.value      = pr
    rawAnnouncements.value = an
  } catch (e: any) {
    if (!loadError.value) loadError.value = e?.message ?? 'Erreur chargement.'
  } finally {
    recentLoading.value = false
  }

  // Écouter la touche Échap pour fermer le tiroir de détail
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      drawer.open = false
    }
  }
  window.addEventListener('keydown', handleKeyDown)
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
