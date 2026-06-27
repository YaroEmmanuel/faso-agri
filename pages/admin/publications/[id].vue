<template>
  <AdminLayout>
    <div class="space-y-6 max-w-2xl">

      <!-- Back -->
      <NuxtLink to="/admin/publications" class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Retour aux Infos Pratiques
      </NuxtLink>

      <!-- Skeleton -->
      <div v-if="loading" class="space-y-4">
        <div class="h-7 w-2/3 bg-gray-100 rounded animate-pulse" />
        <div class="h-4 w-1/3 bg-gray-100 rounded animate-pulse" />
        <div class="space-y-2 mt-6">
          <div v-for="i in 5" :key="i" class="h-3 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>

      <!-- Contenu -->
      <div v-else-if="info">
        <!-- En-tête -->
        <div class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap mb-2">
                <span v-if="info.category" class="text-xs px-2.5 py-0.5 rounded-full font-medium bg-green-50 text-green-700">
                  {{ info.category }}
                </span>
                <span class="inline-flex items-center gap-1 text-xs text-gray-400">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ info.readMinutes ?? 3 }} min de lecture
                </span>
              </div>
              <h1 class="text-lg font-bold text-gray-900">{{ info.title }}</h1>
              <p class="text-sm text-gray-500 mt-1">
                <span class="font-medium">{{ info.author || 'Auteur inconnu' }}</span>
                · {{ formatDate(info.createdAt) }}
              </p>
            </div>
            <div class="flex gap-2 flex-shrink-0">
              <button @click="openEditor" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Modifier
              </button>
              <button @click="deleteInfo" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-red-200 rounded-xl text-red-500 hover:bg-red-50 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Supprimer
              </button>
            </div>
          </div>

          <!-- Description -->
          <p v-if="info.description" class="text-sm text-gray-600 italic border-l-4 border-green-200 pl-3">
            {{ info.description }}
          </p>

          <!-- Tags -->
          <div v-if="info.tags?.length" class="flex flex-wrap gap-1.5">
            <span v-for="tag in info.tags" :key="tag" class="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
              #{{ tag }}
            </span>
          </div>
        </div>

        <!-- Contenu -->
        <div class="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Contenu</h2>
          <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{{ info.content || 'Aucun contenu.' }}</p>
        </div>
      </div>

      <!-- Not found -->
      <div v-else-if="!loading" class="text-center py-16 text-gray-400 text-sm">
        Info pratique introuvable.
      </div>

      <!-- Error -->
      <div v-if="loadError" class="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-700">
        ⚠️ {{ loadError }}
      </div>

    </div>

    <!-- Modal édition -->
    <Teleport to="body">
      <div v-if="editorOpen" class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="editorOpen = false">
        <div class="bg-white rounded-2xl w-full max-w-xl shadow-2xl max-h-[90vh] flex flex-col">

          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <h2 class="font-semibold text-gray-900 text-sm">Modifier l'info pratique</h2>
            <button @click="editorOpen = false" class="text-gray-400 hover:text-gray-600 transition">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="overflow-y-auto flex-1 px-6 py-5 space-y-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Titre</label>
              <input v-model="form.title" type="text" class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Description courte</label>
              <input v-model="form.description" type="text" class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Contenu</label>
              <textarea v-model="form.content" rows="6" class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Catégorie</label>
                <select v-model="form.category" class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
                  <option value="">Sans catégorie</option>
                  <option>Agriculture</option><option>Élevage</option><option>Techniques</option>
                  <option>Saisonnières</option><option>Santé animale</option><option>Gestion</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Auteur</label>
                <input v-model="form.author" type="text" class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Tags (virgules)</label>
                <input v-model="form.tagsInput" type="text" class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Temps de lecture (min)</label>
                <input v-model.number="form.readMinutes" type="number" min="1" class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" />
              </div>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
            <button @click="editorOpen = false" type="button" class="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">Annuler</button>
            <button @click="saveEdit" :disabled="saving" class="flex-1 px-4 py-2 text-sm bg-primary text-white rounded-xl hover:opacity-90 transition disabled:opacity-50">
              {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
            </button>
          </div>

        </div>
      </div>
    </Teleport>

  </AdminLayout>
</template>

<script setup lang="ts">
const { $firestore } = useNuxtApp()
const route = useRoute()
const router = useRouter()
definePageMeta({ middleware: 'admin' })

const id = route.params.id as string
const COLLECTION = 'practical_infos'

const info      = ref<any>(null)
const loading   = ref(false)
const loadError = ref('')
const editorOpen = ref(false)
const saving     = ref(false)

const form = reactive({
  title: '', description: '', content: '', category: '', author: '', tagsInput: '', readMinutes: 3
})

function formatDate(ts: any) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function openEditor() {
  form.title       = info.value?.title ?? ''
  form.description = info.value?.description ?? ''
  form.content     = info.value?.content ?? ''
  form.category    = info.value?.category ?? ''
  form.author      = info.value?.author ?? ''
  form.tagsInput   = (info.value?.tags ?? []).join(', ')
  form.readMinutes = info.value?.readMinutes ?? 3
  editorOpen.value = true
}

async function saveEdit() {
  saving.value = true
  try {
    const tags = form.tagsInput.split(',').map((t: string) => t.trim()).filter(Boolean)
    const payload = { title: form.title, description: form.description, content: form.content, category: form.category, author: form.author, tags, readMinutes: form.readMinutes }
    if ($firestore) {
      const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore')
      await updateDoc(doc($firestore as any, COLLECTION, id), { ...payload, updatedAt: serverTimestamp() })
    }
    Object.assign(info.value, payload)
    editorOpen.value = false
  } catch (e: any) {
    alert('Erreur : ' + (e.message ?? 'inconnue'))
  } finally {
    saving.value = false
  }
}

async function deleteInfo() {
  if (!confirm('Supprimer cette info pratique définitivement ?')) return
  try {
    if ($firestore) {
      const { doc, deleteDoc } = await import('firebase/firestore')
      await deleteDoc(doc($firestore as any, COLLECTION, id))
    }
    router.push('/admin/publications')
  } catch (e: any) {
    alert('Erreur : ' + (e.message ?? 'inconnue'))
  }
}

onMounted(async () => {
  if (!$firestore) { loadError.value = 'Firebase non configuré.'; return }
  loading.value = true
  try {
    const { doc, getDoc } = await import('firebase/firestore')
    const snap = await getDoc(doc($firestore as any, COLLECTION, id))
    if (snap.exists()) {
      info.value = { id: snap.id, ...snap.data() }
    }
  } catch (e: any) {
    loadError.value = e?.message ?? 'Erreur de chargement.'
  } finally {
    loading.value = false
  }
})

useSeoMeta({ title: computed(() => (info.value?.title ?? 'Info Pratique') + ' — Admin Faso Agri') })
</script>
