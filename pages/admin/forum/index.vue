<template>
  <AdminLayout>
    <div class="space-y-5">

      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900">Forum</h1>
          <p class="text-sm text-gray-400 mt-0.5">Gestion des discussions de la communauté</p>
        </div>
        <button
          @click="exportCsv"
          class="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 rounded-xl transition"
        >
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Exporter en CSV
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          v-for="tab in tabs" :key="tab.key"
          @click="activeTab = tab.key"
          :class="activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'"
          class="relative px-5 py-1.5 rounded-lg text-sm font-medium transition"
        >
          {{ tab.label }}
          <span
            v-if="tab.badge > 0"
            class="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center"
          >{{ tab.badge }}</span>
        </button>
      </div>

      <!-- Sujets / Discussions -->
      <div v-if="activeTab === 'topics'" class="space-y-3">
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 6" :key="i" class="h-16 bg-gray-100 rounded-xl animate-pulse" />
        </div>

        <div
          v-for="topic in topics" :key="topic.id"
          :class="topic.reported ? 'border-red-100 bg-red-50/30 shadow-[0_8px_30px_rgb(239,68,68,0.015)]' : 'border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.012)]'"
          class="rounded-2xl border p-5 hover:border-primary/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.035)] hover:-translate-y-0.5 transition-all duration-300"
        >
          <div class="flex items-start justify-between gap-4">
            <!-- Infos cliquables -->
            <button class="flex-1 min-w-0 text-left group" @click="openDrawer(topic)">
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <span v-if="topic.status === 'closed'" class="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  Fermé
                </span>
                <span v-if="topic.reported" class="inline-flex items-center gap-1 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
                  Signalé
                </span>
                <span v-if="topic.category" class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{{ topic.category }}</span>
              </div>
              <p class="font-medium text-gray-900 group-hover:text-primary transition line-clamp-1">{{ topic.title || topic.content || '(Sans titre)' }}</p>
              <p class="text-xs text-gray-400 mt-0.5">
                <span class="font-medium text-gray-500">{{ topic.authorName || 'Anonyme' }}</span>
                · {{ topic.replies ?? topic.replyCount ?? 0 }} réponse{{ (topic.replies ?? topic.replyCount ?? 0) !== 1 ? 's' : '' }}
                · {{ formatDate(topic.createdAt) }}
              </p>
            </button>
            <!-- Actions -->
            <div class="flex items-center gap-1 flex-shrink-0">
              <!-- Voir détails -->
              <button @click="openDrawer(topic)" title="Voir les détails"
                class="p-2 rounded-lg hover:bg-primary/10 transition text-gray-400 hover:text-primary">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
              <!-- Fermer/Rouvrir -->
              <button @click="closeTopic(topic)" :title="topic.status === 'closed' ? 'Rouvrir' : 'Fermer'"
                class="p-2 rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-gray-700">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </button>
              <!-- Supprimer -->
              <button @click="deleteTopic(topic.id)" title="Supprimer"
                class="p-2 rounded-lg hover:bg-red-50 transition text-gray-400 hover:text-red-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <p v-if="!loading && topics.length === 0" class="text-center text-sm text-gray-400 py-10">Aucun sujet de forum.</p>
      </div>

      <!-- Signalements -->
      <div v-if="activeTab === 'reported'" class="space-y-3">
        <div v-for="item in reportedItems" :key="item.id" class="bg-white rounded-2xl border border-red-100 p-4">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <p class="text-xs text-red-500 font-medium mb-1 uppercase tracking-wide">{{ item.type === 'topic' ? 'Sujet' : 'Réponse' }}</p>
              <p class="text-sm text-gray-800 line-clamp-2">{{ item.content ?? item.title ?? '(Contenu vide)' }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ item.authorName ?? 'Anonyme' }} · {{ formatDate(item.createdAt) }}</p>
            </div>
            <button @click="deleteReported(item)"
              class="text-xs text-red-500 hover:text-red-700 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition flex-shrink-0">
              Supprimer
            </button>
          </div>
        </div>
        <p v-if="reportedItems.length === 0" class="text-center text-sm text-gray-400 py-10">Aucun contenu signalé.</p>
      </div>

      <!-- Error -->
      <div v-if="loadError" class="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-700">
        ⚠️ {{ loadError }}
      </div>

    </div>

    <!-- ── Drawer de détail / fil de discussion ──────────────────────────── -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="drawer.open" class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" @click="drawer.open = false" />
      </Transition>

      <Transition name="slide">
        <div v-if="drawer.open" class="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col">

          <!-- En-tête -->
          <div class="flex items-start justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
            <div class="flex-1 min-w-0 pr-4">
              <div class="flex flex-wrap gap-1.5 mb-2">
                <span v-if="drawer.topic?.category" class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{{ drawer.topic.category }}</span>
                <span v-if="drawer.topic?.status === 'closed'" class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Fermé</span>
                <span v-if="drawer.topic?.reported" class="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">Signalé</span>
              </div>
              <h2 class="text-base font-bold text-gray-900 leading-snug">{{ drawer.topic?.title || drawer.topic?.content || '(Sans titre)' }}</h2>
              <p class="text-xs text-gray-400 mt-1">
                {{ drawer.topic?.authorName ?? 'Anonyme' }}
                · {{ formatDate(drawer.topic?.createdAt) }}
              </p>
            </div>
            <button @click="drawer.open = false" class="text-gray-400 hover:text-gray-600 transition p-1 flex-shrink-0">
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

            <template v-else>
              <!-- Corps du message original -->
              <div v-if="drawer.topic?.content || drawer.topic?.title">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Message original</p>
                <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold flex-shrink-0">
                      {{ initials(drawer.topic?.authorName ?? 'A') }}
                    </div>
                    <div>
                      <p class="text-xs font-semibold text-gray-800">{{ drawer.topic?.authorName ?? 'Anonyme' }}</p>
                      <p class="text-[10px] text-gray-400">{{ formatDate(drawer.topic?.createdAt) }}</p>
                    </div>
                  </div>
                  <p class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{{ drawer.topic?.content ?? drawer.topic?.title ?? '—' }}</p>
                </div>
              </div>

              <!-- Fil de réponses -->
              <div>
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Fil de discussion
                  <span class="text-gray-500 ml-1">({{ drawer.replies.length }} réponse{{ drawer.replies.length !== 1 ? 's' : '' }})</span>
                </p>

                <div v-if="drawer.replies.length === 0" class="text-center py-6 text-sm text-gray-400 bg-gray-50 rounded-xl border border-gray-100">
                  Aucune réponse pour l'instant.
                </div>

                <div v-else class="space-y-3">
                  <div v-for="reply in drawer.replies" :key="reply.id" class="flex gap-3">
                    <div class="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center text-primary text-[10px] font-bold flex-shrink-0 mt-0.5">
                      {{ initials(reply.authorName ?? 'A') }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3 border border-gray-100">
                        <div class="flex items-baseline justify-between gap-2 mb-1.5">
                          <p class="text-xs font-semibold text-gray-800">{{ reply.authorName ?? 'Anonyme' }}</p>
                          <p class="text-[10px] text-gray-400 flex-shrink-0">{{ formatDate(reply.createdAt) }}</p>
                        </div>
                        <p class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{{ reply.content ?? '—' }}</p>
                      </div>
                      <!-- Supprimer réponse -->
                      <button
                        @click="deleteReply(drawer.topic?.id, reply.id)"
                        class="mt-1 ml-1 text-[11px] text-gray-400 hover:text-red-500 transition"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- Pied du drawer -->
          <div class="flex items-center gap-2 px-6 py-4 border-t border-gray-100 flex-shrink-0">
            <button
              @click="toggleClose"
              class="px-3 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
            >
              {{ drawer.topic?.status === 'closed' ? 'Rouvrir' : 'Fermer' }}
            </button>
            <div class="flex-1" />
            <button
              @click="deleteTopic(drawer.topic?.id); drawer.open = false"
              class="px-3 py-2 text-sm border border-red-200 rounded-xl text-red-500 hover:bg-red-50 transition"
            >
              Supprimer le sujet
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
useSeoMeta({ title: 'Forum — Admin Faso Agri' })

const loading       = ref(false)
const loadError     = ref('')
const topics        = ref<any[]>([])
const reportedItems = ref<any[]>([])

const reportedCount = computed(() => reportedItems.value.length)
const tabs = computed(() => [
  { key: 'topics',   label: 'Discussions',  badge: 0 },
  { key: 'reported', label: 'Signalements', badge: reportedCount.value },
])
const activeTab = ref('topics')

// ── Drawer ──────────────────────────────────────────────────────────────────
const drawer = reactive({
  open: false,
  loading: false,
  topic: null as any,
  replies: [] as any[],
})

function initials(name: string) {
  return name ? name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() : '?'
}

function formatDate(ts: any) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function openDrawer(topic: any) {
  drawer.topic   = topic
  drawer.replies = []
  drawer.open    = true
  drawer.loading = true
  try {
    if ($firestore) {
      const { collection, query, orderBy, getDocs } = await import('firebase/firestore')
      const fs = $firestore as any
      try {
        const repSnap = await getDocs(
          query(collection(fs, 'discussions', topic.id, 'replies'), orderBy('createdAt', 'asc'))
        )
        drawer.replies = repSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }))
      } catch {
        // Sous-collection vide ou absente — normal
        drawer.replies = []
      }
    }
  } catch (e) {
    console.error('[Forum Drawer]', e)
  } finally {
    drawer.loading = false
  }
}

async function toggleClose() {
  if (!drawer.topic) return
  const newStatus = drawer.topic.status === 'closed' ? 'open' : 'closed'
  if ($firestore) {
    const { doc, updateDoc } = await import('firebase/firestore')
    await updateDoc(doc($firestore as any, 'discussions', drawer.topic.id), { status: newStatus })
  }
  drawer.topic.status = newStatus
  // Mettre à jour dans la liste aussi
  const idx = topics.value.findIndex(t => t.id === drawer.topic.id)
  if (idx !== -1) topics.value[idx].status = newStatus
}

async function deleteReply(topicId: string, replyId: string) {
  if (!confirm('Supprimer cette réponse ?')) return
  if ($firestore) {
    const { doc, deleteDoc } = await import('firebase/firestore')
    await deleteDoc(doc($firestore as any, 'discussions', topicId, 'replies', replyId))
  }
  drawer.replies = drawer.replies.filter(r => r.id !== replyId)
  // Décrémenter le compteur dans le topic
  const t = topics.value.find(t => t.id === topicId)
  if (t && (t.replies ?? 0) > 0) t.replies = (t.replies ?? 1) - 1
}

function exportCsv() {
  const headers = ['Titre / Message', 'Auteur', 'Catégorie', 'Réponses', 'Statut', 'Signalement', 'Date']
  const rows = topics.value.map(t => [
    t.title ?? t.content ?? '',
    t.authorName ?? 'Anonyme',
    t.category ?? '',
    t.replies ?? t.replyCount ?? 0,
    t.status ?? 'open',
    t.reported ? 'Oui' : 'Non',
    formatDate(t.createdAt)
  ])
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a'); a.href = url; a.download = 'forum-discussions.csv'; a.click()
  URL.revokeObjectURL(url)
}

async function closeTopic(topic: any) {
  const newStatus = topic.status === 'closed' ? 'open' : 'closed'
  if ($firestore) {
    const { doc, updateDoc } = await import('firebase/firestore')
    await updateDoc(doc($firestore as any, 'discussions', topic.id), { status: newStatus })
  }
  topic.status = newStatus
}

async function deleteTopic(id: string) {
  if (!id) return
  if (!confirm('Supprimer ce sujet définitivement ?')) return
  if ($firestore) {
    const { doc, deleteDoc } = await import('firebase/firestore')
    await deleteDoc(doc($firestore as any, 'discussions', id))
  }
  topics.value = topics.value.filter(t => t.id !== id)
}

async function deleteReported(item: any) {
  if (!confirm('Supprimer ce contenu ?')) return
  if ($firestore) {
    const { doc, deleteDoc } = await import('firebase/firestore')
    const col = item.type === 'topic' ? 'discussions' : 'replies'
    await deleteDoc(doc($firestore as any, col, item.id))
  }
  reportedItems.value = reportedItems.value.filter(i => i.id !== item.id)
}

onMounted(async () => {
  if (!$firestore) {
    loadError.value = 'Firebase non configuré.'
    return
  }
  loadError.value = ''
  loading.value = true
  try {
    const { collection, query, orderBy, getDocs, where } = await import('firebase/firestore')
    const fs = $firestore as any

    try {
      const topicsSnap = await getDocs(query(collection(fs, 'discussions'), orderBy('createdAt', 'desc')))
      topics.value = topicsSnap.docs.map(d => ({ id: d.id, ...d.data() }))
    } catch {
      // Fallback sans tri si index absent
      const topicsSnap = await getDocs(collection(fs, 'discussions'))
      topics.value = topicsSnap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a: any, b: any) => (b.createdAt?.toDate?.()?.getTime() ?? 0) - (a.createdAt?.toDate?.()?.getTime() ?? 0))
    }

    // Discussions signalées
    try {
      const repSnap = await getDocs(query(collection(fs, 'discussions'), where('reported', '==', true)))
      reportedItems.value = repSnap.docs.map(d => ({ id: d.id, type: 'topic', ...d.data() }))
    } catch { /* champ 'reported' absent */ }

  } catch (e: any) {
    console.error('[Forum]', e)
    loadError.value = e?.message ?? 'Erreur lors du chargement du forum.'
  } finally {
    loading.value = false
  }

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
