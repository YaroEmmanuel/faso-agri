<template>
  <AdminLayout>
    <div class="space-y-5">

      <!-- En-tête -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-semibold text-gray-900">Publications</h1>
          <p class="text-sm text-gray-400 mt-0.5">Contenus éditoriaux et notifications</p>
        </div>
        <button
          @click="openEditor()"
          class="inline-flex items-center gap-2 bg-primary text-white text-sm px-4 py-2 rounded-xl hover:opacity-90 transition"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nouvelle publication
        </button>
      </div>

      <!-- Filtres -->
      <div class="flex flex-wrap gap-3">
        <select
          v-model="filterType"
          class="px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
        >
          <option value="">Tous les types</option>
          <option value="news">Actualité</option>
          <option value="advice">Conseil agricole</option>
          <option value="alert">Alerte</option>
          <option value="announcement">Annonce</option>
        </select>
        <select
          v-model="filterStatus"
          class="px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
        >
          <option value="">Tous les statuts</option>
          <option value="draft">Brouillon</option>
          <option value="published">Publié</option>
          <option value="archived">Archivé</option>
        </select>
      </div>

      <!-- Liste -->
      <div class="space-y-3">
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 5" :key="i" class="h-20 bg-gray-100 rounded-2xl animate-pulse" />
        </div>

        <div
          v-for="pub in filteredPubs"
          :key="pub.id"
          class="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                <span :class="typeBadge(pub.type)" class="text-xs px-2.5 py-0.5 rounded-full font-medium">
                  {{ typeLabel(pub.type) }}
                </span>
                <span :class="statusBadge(pub.status)" class="text-xs px-2.5 py-0.5 rounded-full font-medium">
                  {{ statusLabel(pub.status) }}
                </span>
                <span v-if="pub.sendNotification" class="text-xs text-gray-400">🔔 Notif. FCM</span>
              </div>
              <p class="font-medium text-gray-900 line-clamp-1">{{ pub.title }}</p>
              <p class="text-xs text-gray-400 mt-0.5">
                {{ pub.targetRegion === 'all' ? 'Diffusion nationale' : pub.targetRegion }} · {{ formatDate(pub.createdAt) }}
              </p>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
              <button
                @click="openEditor(pub)"
                class="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
                title="Modifier"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              <button
                @click="archivePub(pub)"
                class="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition"
                title="Archiver"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <p v-if="!loading && filteredPubs.length === 0" class="text-center text-sm text-gray-400 py-10">
          Aucune publication trouvée.
        </p>
      </div>
    </div>

    <!-- Modal éditeur -->
    <Teleport to="body">
      <div
        v-if="editorOpen"
        class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="editorOpen = false"
      >
        <div class="bg-white rounded-2xl w-full max-w-xl shadow-2xl max-h-[90vh] flex flex-col">

          <!-- Header modal -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <h2 class="font-semibold text-gray-900 text-sm">
              {{ editingId ? 'Modifier la publication' : 'Nouvelle publication' }}
            </h2>
            <button @click="editorOpen = false" class="text-gray-400 hover:text-gray-600 transition">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Formulaire -->
          <div class="overflow-y-auto flex-1 px-6 py-5 space-y-4">

            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Titre</label>
              <input
                v-model="form.title"
                type="text"
                placeholder="Titre de la publication"
                class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Type</label>
                <select
                  v-model="form.type"
                  class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                >
                  <option value="news">Actualité</option>
                  <option value="advice">Conseil agricole</option>
                  <option value="alert">Alerte</option>
                  <option value="announcement">Annonce</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Région cible</label>
                <select
                  v-model="form.targetRegion"
                  class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                >
                  <option value="all">Nationale</option>
                  <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Contenu</label>
              <textarea
                v-model="form.body"
                rows="5"
                placeholder="Contenu de la publication…"
                class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
              />
            </div>

            <!-- Options -->
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <label class="flex items-center gap-2 cursor-pointer flex-1">
                <div
                  @click="form.sendNotification = !form.sendNotification"
                  :class="form.sendNotification ? 'bg-primary' : 'bg-gray-200'"
                  class="relative w-9 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0"
                >
                  <span
                    :class="form.sendNotification ? 'translate-x-4' : 'translate-x-0.5'"
                    class="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                  />
                </div>
                <span class="text-sm text-gray-600">Envoyer une notification push FCM</span>
              </label>
            </div>

          </div>

          <!-- Footer modal -->
          <div class="px-6 py-4 border-t border-gray-100 flex items-center gap-3 flex-shrink-0">
            <button
              @click="save('draft')"
              :disabled="saving"
              class="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition disabled:opacity-50"
            >
              Enregistrer brouillon
            </button>
            <button
              @click="save('published')"
              :disabled="saving || !form.title"
              class="flex-1 px-4 py-2 text-sm bg-primary text-white rounded-xl hover:opacity-90 transition disabled:opacity-50"
            >
              <span v-if="!saving">Publier</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Publication…
              </span>
            </button>
          </div>

        </div>
      </div>
    </Teleport>

  </AdminLayout>
</template>

<script setup lang="ts">
import {
  collection, query, orderBy, getDocs,
  doc, updateDoc, addDoc, serverTimestamp
} from 'firebase/firestore'

const { $firestore } = useNuxtApp()

definePageMeta({ middleware: 'admin' })
useSeoMeta({ title: 'Publications — Admin Faso Agri' })

const regions = [
  'Centre', 'Hauts-Bassins', 'Cascades', 'Est', 'Nord',
  'Centre-Nord', 'Centre-Ouest', 'Centre-Est', 'Boucle du Mouhoun', 'Sahel',
  'Sud-Ouest', 'Plateau-Central', 'Centre-Sud',
]

const pubs = ref<any[]>([])
const loading = ref(true)
const filterType = ref('')
const filterStatus = ref('')

const filteredPubs = computed(() => {
  return pubs.value.filter(p => {
    const matchType   = !filterType.value   || p.type   === filterType.value
    const matchStatus = !filterStatus.value || p.status === filterStatus.value
    return matchType && matchStatus
  })
})

// --- Éditeur ---
const editorOpen = ref(false)
const editingId  = ref<string | null>(null)
const saving     = ref(false)

const defaultForm = () => ({
  title: '', body: '', type: 'news', targetRegion: 'all', sendNotification: false,
})
const form = reactive(defaultForm())

function openEditor(pub?: any) {
  editingId.value = pub?.id ?? null
  Object.assign(form, pub ? {
    title: pub.title, body: pub.body, type: pub.type,
    targetRegion: pub.targetRegion, sendNotification: pub.sendNotification,
  } : defaultForm())
  editorOpen.value = true
}

async function save(status: 'draft' | 'published') {
  if (!form.title) return
  saving.value = true
  try {
    const payload = {
      ...form,
      status,
      ...(status === 'published' ? { publishedAt: serverTimestamp() } : {}),
    }
    if (editingId.value) {
      await updateDoc(doc($firestore, 'publications', editingId.value), payload)
      pubs.value = pubs.value.map(p => p.id === editingId.value ? { ...p, ...payload } : p)
    } else {
      const ref = await addDoc(collection($firestore, 'publications'), {
        ...payload, createdAt: serverTimestamp(), createdBy: 'admin',
      })
      pubs.value = [{ id: ref.id, ...payload, createdAt: new Date() }, ...pubs.value]
    }
    editorOpen.value = false
  } finally {
    saving.value = false
  }
}

async function archivePub(pub: any) {
  if (!confirm('Archiver cette publication ?')) return
  await updateDoc(doc($firestore, 'publications', pub.id), { status: 'archived' })
  pub.status = 'archived'
}

function formatDate(ts: any) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function typeBadge(t: string) {
  const m: Record<string, string> = {
    news: 'bg-blue-50 text-blue-600', advice: 'bg-yellow-50 text-yellow-700',
    alert: 'bg-red-50 text-red-600', announcement: 'bg-green-50 text-green-700',
  }
  return m[t] ?? 'bg-gray-100 text-gray-500'
}
function typeLabel(t: string) {
  const m: Record<string, string> = {
    news: 'Actualité', advice: 'Conseil', alert: 'Alerte', announcement: 'Annonce'
  }
  return m[t] ?? t
}
function statusBadge(s: string) {
  const m: Record<string, string> = {
    published: 'bg-green-50 text-green-700', draft: 'bg-gray-100 text-gray-500', archived: 'bg-gray-100 text-gray-400',
  }
  return m[s] ?? 'bg-gray-100 text-gray-400'
}
function statusLabel(s: string) {
  const m: Record<string, string> = { published: 'Publié', draft: 'Brouillon', archived: 'Archivé' }
  return m[s] ?? s
}

onMounted(async () => {
  const snap = await getDocs(query(collection($firestore, 'publications'), orderBy('createdAt', 'desc')))
  pubs.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  loading.value = false
})
</script>
