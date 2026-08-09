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
                <span :class="statusBadge(info.status ?? 'published')" class="text-xs px-2.5 py-0.5 rounded-full font-medium">
                  {{ statusLabel(info.status ?? 'published') }}
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
            <div class="flex gap-2 flex-shrink-0 flex-wrap justify-end">

              <!-- Activer -->
              <button
                v-if="(info.status ?? 'published') !== 'published'"
                @click="updateStatus('published')"
                :disabled="statusUpdating"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-green-200 rounded-xl text-green-600 hover:bg-green-50 transition disabled:opacity-50"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                Activer
              </button>

              <!-- Désactiver -->
              <button
                v-if="(info.status ?? 'published') === 'published'"
                @click="updateStatus('draft')"
                :disabled="statusUpdating"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-orange-200 rounded-xl text-orange-500 hover:bg-orange-50 transition disabled:opacity-50"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
                Désactiver
              </button>

              <!-- Modifier -->
              <button @click="openEditor" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Modifier
              </button>

              <!-- Supprimer -->
              <button
                v-if="isSuperAdmin"
                @click="askDeleteInfo" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-red-200 rounded-xl text-red-500 hover:bg-red-50 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Supprimer
              </button>
              <button
                v-else
                disabled
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-xl text-gray-300 cursor-not-allowed transition" title="Seul un super admin peut supprimer">
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

        <!-- Image -->
        <div v-if="info.imageUrl || info.imageBase64" class="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Image</h2>
          <img
            :src="info.imageBase64 ? (info.imageBase64.startsWith('data:') ? info.imageBase64 : `data:image/jpeg;base64,${info.imageBase64}`) : info.imageUrl"
            class="w-full max-h-72 object-cover rounded-xl border border-gray-100"
            alt="Image de l'info pratique"
          />
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
            <div class="grid grid-cols-3 gap-3">
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
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Statut</label>
                <select v-model="form.status" class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
                  <option value="published">Publié</option>
                  <option value="draft">Brouillon</option>
                  <option value="archived">Archivé</option>
                </select>
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

            <!-- Image -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Image</label>

              <!-- Prévisualisation -->
              <div v-if="form.imagePreview" class="mb-2 relative w-full h-36 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                <img :src="form.imagePreview" class="w-full h-full object-cover" alt="Aperçu" />
                <button
                  type="button"
                  @click="clearImage"
                  class="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 rounded-lg p-1 shadow-sm transition"
                  title="Retirer l'image"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              <!-- Upload fichier -->
              <label class="flex items-center gap-2 w-full px-4 py-2.5 text-sm rounded-xl border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer transition text-gray-500">
                <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                <span>{{ form.imageFile ? form.imageFile.name : 'Choisir une image…' }}</span>
                <input ref="imageFileInput" type="file" accept="image/*" class="hidden" @change="onImageFileChange" />
              </label>

              <!-- OU URL -->
              <div class="flex items-center gap-2 mt-2">
                <div class="flex-1 h-px bg-gray-200" />
                <span class="text-[10px] text-gray-400 uppercase tracking-wide">ou URL</span>
                <div class="flex-1 h-px bg-gray-200" />
              </div>
              <input
                v-model="form.imageUrl"
                type="url"
                placeholder="https://…"
                class="mt-2 w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                @input="onImageUrlInput"
              />
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

    <AdminConfirmModal
      :isOpen="deleteModalOpen"
      :loading="deleting"
      title="Supprimer l'info pratique ?"
      @close="deleteModalOpen = false"
      @confirm="confirmDeleteInfo"
    />

  </AdminLayout>
</template>

<script setup lang="ts">
const { $firestore } = useNuxtApp()
const route = useRoute()
const router = useRouter()
definePageMeta({ middleware: 'admin' })

const { isSuperAdmin } = useAdminAuth()

const id = route.params.id as string
const COLLECTION = 'practical_infos'

const info      = ref<any>(null)
const loading   = ref(false)
const loadError = ref('')
const editorOpen = ref(false)
const saving     = ref(false)

const deleteModalOpen = ref(false)
const deleting = ref(false)

const form = reactive({
  title: '', description: '', content: '', category: '', author: '',
  status: 'published' as string,
  tagsInput: '', readMinutes: 3,
  imageBase64: '' as string, imageUrl: '' as string, imagePreview: '' as string, imageFile: null as File | null
})

const imageFileInput = ref<HTMLInputElement | null>(null)
const statusUpdating = ref(false)

function statusBadge(s: string) {
  const map: Record<string, string> = {
    published: 'bg-green-50 text-green-700 border border-green-200',
    draft: 'bg-orange-50 text-orange-600 border border-orange-200',
    archived: 'bg-gray-100 text-gray-500 border border-gray-200'
  }
  return map[s] ?? 'bg-green-50 text-green-700 border border-green-200'
}

function statusLabel(s: string) {
  const map: Record<string, string> = {
    published: 'Actif',
    draft: 'Désactivé',
    archived: 'Archivé'
  }
  return map[s] ?? 'Actif'
}

async function updateStatus(newStatus: 'published' | 'draft' | 'archived') {
  if (!info.value) return
  statusUpdating.value = true
  try {
    if ($firestore) {
      const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore')
      await updateDoc(doc($firestore as any, COLLECTION, id), { status: newStatus, updatedAt: serverTimestamp() })
    }
    info.value.status = newStatus
  } catch (e: any) {
    alert('Erreur : ' + (e.message ?? 'inconnue'))
  } finally {
    statusUpdating.value = false
  }
}

function onImageFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  form.imageFile = file
  form.imageUrl = ''
  const reader = new FileReader()
  reader.onload = (ev) => {
    form.imagePreview = ev.target?.result as string
    form.imageBase64 = (ev.target?.result as string).split(',')[1] ?? ''
  }
  reader.readAsDataURL(file)
}

function onImageUrlInput() {
  form.imageFile = null
  form.imageBase64 = ''
  form.imagePreview = form.imageUrl
  if (imageFileInput.value) imageFileInput.value.value = ''
}

function clearImage() {
  form.imageFile = null
  form.imageBase64 = ''
  form.imageUrl = ''
  form.imagePreview = ''
  if (imageFileInput.value) imageFileInput.value.value = ''
}

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
  form.status      = info.value?.status ?? 'published'
  form.tagsInput   = (info.value?.tags ?? []).join(', ')
  form.readMinutes = info.value?.readMinutes ?? 3
  form.imageBase64 = info.value?.imageBase64 ?? ''
  form.imageUrl    = info.value?.imageUrl ?? ''
  form.imageFile   = null
  if (info.value?.imageBase64) {
    form.imagePreview = info.value.imageBase64.startsWith('data:') ? info.value.imageBase64 : `data:image/jpeg;base64,${info.value.imageBase64}`
  } else if (info.value?.imageUrl) {
    form.imagePreview = info.value.imageUrl
  } else {
    form.imagePreview = ''
  }
  editorOpen.value = true
}

async function saveEdit() {
  saving.value = true
  try {
    const tags = form.tagsInput.split(',').map((t: string) => t.trim()).filter(Boolean)
    const payload: any = {
      title: form.title, description: form.description, content: form.content,
      category: form.category, author: form.author, tags,
      readMinutes: form.readMinutes, status: form.status
    }

    // Gestion de l'image
    if (form.imageBase64) {
      payload.imageBase64 = form.imageBase64
      payload.imageUrl = ''
    } else if (form.imageUrl) {
      payload.imageUrl = form.imageUrl
      payload.imageBase64 = ''
    }

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

function askDeleteInfo() {
  if (!isSuperAdmin.value) return
  deleteModalOpen.value = true
}

async function confirmDeleteInfo() {
  deleting.value = true
  try {
    if ($firestore) {
      const { doc, deleteDoc } = await import('firebase/firestore')
      await deleteDoc(doc($firestore as any, COLLECTION, id))
    }
    router.push('/admin/publications')
  } catch (e: any) {
    alert('Erreur : ' + (e.message ?? 'inconnue'))
    deleting.value = false
    deleteModalOpen.value = false
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
