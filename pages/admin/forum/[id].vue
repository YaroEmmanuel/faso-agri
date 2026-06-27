<template>
  <AdminLayout>
    <div class="space-y-6 max-w-2xl">

      <!-- Back -->
      <NuxtLink to="/admin/forum" class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Retour au Forum
      </NuxtLink>

      <!-- Skeleton -->
      <div v-if="loading" class="space-y-4">
        <div class="h-7 w-2/3 bg-gray-100 rounded animate-pulse" />
        <div class="h-4 w-1/3 bg-gray-100 rounded animate-pulse" />
        <div class="space-y-2 mt-6">
          <div v-for="i in 4" :key="i" class="h-3 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>

      <!-- Contenu -->
      <div v-else-if="topic" class="space-y-4">
        <!-- En-tête -->
        <div class="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap mb-2">
                <span v-if="topic.isPinned || topic.status === 'pinned'"
                  class="text-xs px-2.5 py-0.5 rounded-full font-medium bg-primary/10 text-primary">Épinglé</span>
                <span v-if="topic.status === 'closed'"
                  class="text-xs px-2.5 py-0.5 rounded-full font-medium bg-gray-100 text-gray-500">Fermé</span>
                <span v-if="topic.reported"
                  class="text-xs px-2.5 py-0.5 rounded-full font-medium bg-red-100 text-red-600">Signalé</span>
                <span v-if="topic.category" class="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500">{{ topic.category }}</span>
              </div>
              <h1 class="text-lg font-bold text-gray-900">{{ topic.title ?? '(Sans titre)' }}</h1>
              <p class="text-sm text-gray-500 mt-1">
                <span class="font-medium">{{ topic.authorName || 'Anonyme' }}</span>
                · {{ topic.replies ?? topic.replyCount ?? 0 }} réponse(s)
                · {{ formatDate(topic.createdAt) }}
              </p>
            </div>
            <div class="flex gap-2 flex-shrink-0">
              <button @click="closeTopic" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">
                {{ topic.status === 'closed' ? 'Rouvrir' : 'Fermer' }}
              </button>
              <button @click="deleteTopic" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-red-200 rounded-xl text-red-500 hover:bg-red-50 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Supprimer
              </button>
            </div>
          </div>

          <!-- Contenu du message -->
          <div v-if="topic.content" class="pt-2 border-t border-gray-50">
            <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{{ topic.content }}</p>
          </div>
        </div>

        <!-- Réponses -->
        <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <h2 class="text-sm font-semibold text-gray-900">Réponses ({{ replies.length }})</h2>
          </div>
          <div v-if="repliesLoading" class="divide-y divide-gray-50">
            <div v-for="i in 3" :key="i" class="px-6 py-4 space-y-2">
              <div class="h-3 w-1/4 bg-gray-100 rounded animate-pulse" />
              <div class="h-3 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
          <div v-else class="divide-y divide-gray-50">
            <div v-for="reply in replies" :key="reply.id" class="px-6 py-4">
              <p class="text-xs font-medium text-gray-500 mb-1">
                {{ reply.authorName ?? 'Anonyme' }} · {{ formatDate(reply.createdAt) }}
              </p>
              <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ reply.content ?? '—' }}</p>
            </div>
            <div v-if="replies.length === 0" class="px-6 py-8 text-center text-sm text-gray-400">
              Aucune réponse pour le moment.
            </div>
          </div>
        </div>
      </div>

      <!-- Not found -->
      <div v-else-if="!loading" class="text-center py-16 text-gray-400 text-sm">Discussion introuvable.</div>

      <!-- Error -->
      <div v-if="loadError" class="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-700">
        ⚠️ {{ loadError }}
      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
const { $firestore } = useNuxtApp()
const route  = useRoute()
const router = useRouter()
definePageMeta({ middleware: 'admin' })

const id = route.params.id as string

const topic         = ref<any>(null)
const replies       = ref<any[]>([])
const loading       = ref(false)
const repliesLoading = ref(false)
const loadError     = ref('')

function formatDate(ts: any) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

async function closeTopic() {
  const newStatus = topic.value.status === 'closed' ? 'open' : 'closed'
  if ($firestore) {
    const { doc, updateDoc } = await import('firebase/firestore')
    await updateDoc(doc($firestore as any, 'discussions', id), { status: newStatus })
  }
  topic.value.status = newStatus
}

async function deleteTopic() {
  if (!confirm('Supprimer cette discussion définitivement ?')) return
  if ($firestore) {
    const { doc, deleteDoc } = await import('firebase/firestore')
    await deleteDoc(doc($firestore as any, 'discussions', id))
  }
  router.push('/admin/forum')
}

onMounted(async () => {
  if (!$firestore) { loadError.value = 'Firebase non configuré.'; return }
  loading.value = true
  try {
    const { doc, getDoc, collection, query, orderBy, getDocs } = await import('firebase/firestore')
    const snap = await getDoc(doc($firestore as any, 'discussions', id))
    if (snap.exists()) {
      topic.value = { id: snap.id, ...snap.data() }
    }

    // Charger les réponses (sous-collection ou collection plate)
    repliesLoading.value = true
    try {
      const repSnap = await getDocs(
        query(collection($firestore as any, 'discussions', id, 'replies'), orderBy('createdAt', 'asc'))
      )
      replies.value = repSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }))
    } catch {
      // sous-collection absente, pas critique
    } finally {
      repliesLoading.value = false
    }
  } catch (e: any) {
    loadError.value = e?.message ?? 'Erreur de chargement.'
  } finally {
    loading.value = false
  }
})

useSeoMeta({ title: computed(() => (topic.value?.title ?? 'Discussion') + ' — Admin Faso Agri') })
</script>
