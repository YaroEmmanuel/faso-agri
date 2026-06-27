<template>
  <AdminLayout>
    <div class="space-y-5">

      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900">Infos Pratiques</h1>
          <p class="text-sm text-gray-400 mt-0.5">Guides et conseils agricoles publiés dans l'application</p>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="exportCsv"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 rounded-xl transition"
          >
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Exporter en CSV
          </button>
          <button
            @click="openEditor()"
            class="inline-flex items-center gap-2 bg-primary text-white text-sm px-4 py-2 rounded-xl hover:opacity-90 transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Nouvelle info pratique
          </button>
        </div>
      </div>

      <!-- Filtres -->
      <div class="flex flex-wrap gap-3">
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher par titre, auteur…"
          class="flex-1 min-w-52 px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
        />
        <select v-model="filterCategory"
          class="px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
          <option value="">Toutes les catégories</option>
          <option value="Agriculture">Agriculture</option>
          <option value="Élevage">Élevage</option>
          <option value="Techniques">Techniques</option>
          <option value="Saisonnières">Saisonnières</option>
          <option value="Santé animale">Santé animale</option>
          <option value="Gestion">Gestion</option>
        </select>
      </div>

      <!-- Liste -->
      <div class="space-y-3">
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 5" :key="i" class="h-20 bg-gray-100 rounded-2xl animate-pulse" />
        </div>

        <div
          v-for="info in filteredInfos" :key="info.id"
          class="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.012)] hover:border-primary/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.035)] hover:-translate-y-0.5 transition-all duration-300"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1.5 flex-wrap">
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
              <p class="font-medium text-gray-900 line-clamp-1">{{ info.title }}</p>
              <p class="text-xs text-gray-400 mt-0.5">
                <span class="font-medium text-gray-500">{{ info.author || 'Auteur inconnu' }}</span>
                · {{ formatDate(info.createdAt) }}
                <span v-if="info.tags?.length" class="ml-1">
                  · {{ info.tags.slice(0, 3).join(', ') }}
                </span>
              </p>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
              <button @click="openEditor(info)" title="Modifier" class="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              <button @click="deleteInfo(info.id)" title="Supprimer" class="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <p v-if="!loading && filteredInfos.length === 0" class="text-center text-sm text-gray-400 py-10">Aucune info pratique trouvée.</p>
      </div>

      <!-- Error -->
      <div v-if="loadError" class="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-700">
        ⚠️ {{ loadError }}
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

          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <h2 class="font-semibold text-gray-900 text-sm">{{ editingId ? 'Modifier l\'info pratique' : 'Nouvelle info pratique' }}</h2>
            <button @click="editorOpen = false" class="text-gray-400 hover:text-gray-600 transition">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="overflow-y-auto flex-1 px-6 py-5 space-y-4">

            <!-- Titre -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Titre</label>
              <input v-model="form.title" type="text" placeholder="Titre de l'info pratique"
                class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" required />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Description courte</label>
              <input v-model="form.description" type="text" placeholder="Résumé en une phrase"
                class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" />
            </div>

            <!-- Contenu -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Contenu</label>
              <textarea v-model="form.content" rows="6" placeholder="Contenu complet de l'info pratique…"
                class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none" />
            </div>

            <!-- Catégorie + Auteur -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Catégorie</label>
                <select v-model="form.category"
                  class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
                  <option value="">Sans catégorie</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Élevage">Élevage</option>
                  <option value="Techniques">Techniques</option>
                  <option value="Saisonnières">Saisonnières</option>
                  <option value="Santé animale">Santé animale</option>
                  <option value="Gestion">Gestion</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Auteur</label>
                <input v-model="form.author" type="text" placeholder="Ex: Dr. Ouédraogo"
                  class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" />
              </div>
            </div>

            <!-- Tags + Temps de lecture -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Tags (séparés par des virgules)</label>
                <input v-model="form.tagsInput" type="text" placeholder="maïs, irrigation, semences"
                  class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Temps de lecture (min)</label>
                <input v-model.number="form.readMinutes" type="number" min="1" placeholder="3"
                  class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" />
              </div>
            </div>

          </div>

          <div class="px-6 py-4 border-t border-gray-100 flex items-center gap-3 flex-shrink-0">
            <button @click="editorOpen = false" type="button"
              class="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition">
              Annuler
            </button>
            <button @click="save()" :disabled="saving || !form.title"
              class="flex-1 px-4 py-2 text-sm bg-primary text-white rounded-xl hover:opacity-90 transition disabled:opacity-50">
              <span v-if="!saving">{{ editingId ? 'Enregistrer les modifications' : 'Publier l\'info pratique' }}</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Enregistrement…
              </span>
            </button>
          </div>

        </div>
      </div>
    </Teleport>

  </AdminLayout>
</template>

<script setup lang="ts">
const { $firestore } = useNuxtApp()
definePageMeta({ middleware: 'admin' })
useSeoMeta({ title: 'Infos Pratiques — Admin Faso Agri' })

const COLLECTION = 'practical_infos'

const infos       = ref<any[]>([])
const loading     = ref(false)
const loadError   = ref('')
const search      = ref('')
const filterCategory = ref('')

const filteredInfos = computed(() =>
  infos.value.filter(i => {
    const term = search.value.toLowerCase()
    const matchSearch = !term ||
      (i.title ?? '').toLowerCase().includes(term) ||
      (i.author ?? '').toLowerCase().includes(term) ||
      (i.tags ?? []).some((t: string) => t.toLowerCase().includes(term))
    const matchCat = !filterCategory.value || i.category === filterCategory.value
    return matchSearch && matchCat
  })
)

// Editor modal
const editorOpen = ref(false)
const editingId  = ref<string | null>(null)
const saving     = ref(false)

const defaultForm = () => ({
  title: '',
  description: '',
  content: '',
  category: '',
  author: 'Administrateur',
  tagsInput: '',
  readMinutes: 3
})
const form = reactive(defaultForm())

function openEditor(info?: any) {
  editingId.value = info?.id ?? null
  if (info) {
    form.title       = info.title ?? ''
    form.description = info.description ?? ''
    form.content     = info.content ?? ''
    form.category    = info.category ?? ''
    form.author      = info.author ?? ''
    form.tagsInput   = (info.tags ?? []).join(', ')
    form.readMinutes = info.readMinutes ?? 3
  } else {
    Object.assign(form, defaultForm())
  }
  editorOpen.value = true
}

async function save() {
  if (!form.title) return
  saving.value = true
  try {
    const tags = form.tagsInput
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0)

    const payload = {
      title:       form.title,
      description: form.description,
      content:     form.content,
      category:    form.category,
      author:      form.author,
      tags,
      readMinutes: form.readMinutes ?? 3,
    }

    if ($firestore) {
      const { doc, updateDoc, addDoc, collection, serverTimestamp } = await import('firebase/firestore')
      const fs = $firestore as any
      if (editingId.value) {
        await updateDoc(doc(fs, COLLECTION, editingId.value), { ...payload, updatedAt: serverTimestamp() })
        infos.value = infos.value.map(i => i.id === editingId.value ? { ...i, ...payload } : i)
      } else {
        const ref = await addDoc(collection(fs, COLLECTION), { ...payload, createdAt: serverTimestamp() })
        infos.value = [{ id: ref.id, ...payload, createdAt: new Date() }, ...infos.value]
      }
    } else {
      // Mode démo
      if (editingId.value) {
        infos.value = infos.value.map(i => i.id === editingId.value ? { ...i, ...payload } : i)
      } else {
        infos.value = [{ id: String(Date.now()), ...payload, createdAt: new Date() }, ...infos.value]
      }
    }
    editorOpen.value = false
  } catch (e: any) {
    console.error('[Infos Pratiques] Save error:', e)
    alert("Erreur lors de l'enregistrement : " + (e.message ?? 'erreur inconnue'))
  } finally {
    saving.value = false
  }
}

async function deleteInfo(id: string) {
  if (!confirm('Supprimer cette info pratique définitivement ?')) return
  try {
    if ($firestore) {
      const { doc, deleteDoc } = await import('firebase/firestore')
      await deleteDoc(doc($firestore as any, COLLECTION, id))
    }
    infos.value = infos.value.filter(i => i.id !== id)
  } catch (e: any) {
    console.error('[Infos Pratiques] Delete error:', e)
    alert("Erreur lors de la suppression : " + (e.message ?? 'erreur inconnue'))
  }
}

function formatDate(ts: any) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function exportCsv() {
  const headers = ['Titre', 'Auteur', 'Catégorie', 'Description', 'Contenu', 'Tags', 'Lecture (min)', 'Date']
  const rows = filteredInfos.value.map(i => [
    i.title ?? '',
    i.author ?? '',
    i.category ?? '',
    i.description ?? '',
    (i.content ?? '').replace(/\n/g, ' '),
    (i.tags ?? []).join(';'),
    i.readMinutes ?? '',
    formatDate(i.createdAt)
  ])
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a'); a.href = url; a.download = 'infos-pratiques.csv'; a.click()
  URL.revokeObjectURL(url)
}

onMounted(async () => {
  if (!$firestore) {
    loadError.value = 'Firebase non configuré — données indisponibles.'
    return
  }
  loadError.value = ''
  loading.value = true
  try {
    const { collection, query, orderBy, getDocs } = await import('firebase/firestore')
    const fs = $firestore as any

    // Essayer 'practical_infos' en premier, puis 'practicalInfos' comme fallback
    const tryLoad = async (colName: string) => {
      try {
        const snap = await getDocs(query(collection(fs, colName), orderBy('createdAt', 'desc')))
        console.log(`[Infos Pratiques] Collection '${colName}': ${snap.docs.length} document(s) trouvé(s)`)
        return snap.docs.map(d => ({ id: d.id, ...d.data() }))
      } catch {
        // orderBy échoue si index absent — essayer sans tri
        try {
          const snap = await getDocs(collection(fs, colName))
          console.log(`[Infos Pratiques] Collection '${colName}' (sans tri): ${snap.docs.length} document(s) trouvé(s)`)
          return snap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .sort((a: any, b: any) => {
              const ta = a.createdAt?.toDate?.()?.getTime() ?? 0
              const tb = b.createdAt?.toDate?.()?.getTime() ?? 0
              return tb - ta
            })
        } catch { return [] }
      }
    }

    let docs = await tryLoad('practical_infos')
    if (docs.length === 0) {
      console.log('[Infos Pratiques] Aucun résultat dans practical_infos, essai practicalInfos...')
      docs = await tryLoad('practicalInfos')
    }
    infos.value = docs
  } catch (e: any) {
    console.error('[Infos Pratiques]', e)
    loadError.value = e?.message ?? 'Erreur lors du chargement des infos pratiques.'
  } finally {
    loading.value = false
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      editorOpen.value = false
    }
  }
  window.addEventListener('keydown', handleKeyDown)
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
})
</script>
