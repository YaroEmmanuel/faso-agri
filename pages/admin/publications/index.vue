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
        <select v-model="filterStatus"
          class="px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
          <option value="">Tous les statuts</option>
          <option value="published">Publié</option>
          <option value="draft">Brouillon</option>
          <option value="archived">Archivé</option>
        </select>
      </div>

      <!-- Liste -->
      <div class="space-y-3">
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 5" :key="i" class="h-20 bg-gray-100 rounded-2xl animate-pulse" />
        </div>

        <div
          v-for="info in paginatedInfos" :key="info.id"
          class="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.012)] hover:border-primary/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.035)] hover:-translate-y-0.5 transition-all duration-300"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1.5 flex-wrap">
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
              <NuxtLink :to="`/admin/publications/${info.id}`" class="font-medium text-gray-900 line-clamp-1 hover:text-primary transition block">
                {{ info.title }}
              </NuxtLink>
              <p class="text-xs text-gray-400 mt-0.5 flex items-center gap-2 flex-wrap">
                <span class="font-medium text-gray-500">{{ info.author || 'Auteur inconnu' }}</span>
                <span class="flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  {{ formatDate(info.createdAt) }}
                </span>
                <span v-if="info.tags?.length">
                  · {{ info.tags.slice(0, 3).join(', ') }}
                </span>
              </p>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">

              <!-- Activer (si draft ou archivé) -->
              <button
                v-if="(info.status ?? 'published') !== 'published'"
                @click="updateStatus(info, 'published')"
                title="Activer la publication"
                class="p-2 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>

              <!-- Désactiver (si publié) -->
              <button
                v-if="(info.status ?? 'published') === 'published'"
                @click="updateStatus(info, 'draft')"
                title="Désactiver (passer en brouillon)"
                class="p-2 rounded-lg hover:bg-orange-50 text-gray-400 hover:text-orange-500 transition"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>

              <!-- Modifier -->
              <button @click="openEditor(info)" title="Modifier" class="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>

              <!-- Supprimer (super admin uniquement) -->
              <button
                v-if="isSuperAdmin"
                @click="askDeleteInfo(info.id)"
                title="Supprimer définitivement"
                class="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
              <button
                v-else
                disabled
                class="p-2 rounded-lg text-gray-200 cursor-not-allowed transition"
                title="Seul un super admin peut supprimer"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>

            </div>
          </div>
        </div>

        <p v-if="!loading && filteredInfos.length === 0" class="text-center text-sm text-gray-400 py-10">Aucune info pratique trouvée.</p>
      </div>

      <!-- Pagination stepper -->
      <div v-if="totalPages > 1" class="flex items-center justify-between text-sm text-gray-400">
        <span>Page {{ currentPage }} / {{ totalPages }} · <strong class="text-gray-600">{{ filteredInfos.length }}</strong> résultat{{ filteredInfos.length !== 1 ? 's' : '' }}</span>
        <div class="flex items-center gap-1.5">
          <button @click="currentPage = 1" :disabled="currentPage === 1"
            class="p-2 rounded-xl border border-gray-200 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition text-gray-500" title="Première page">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/></svg>
          </button>
          <button @click="currentPage--" :disabled="currentPage === 1"
            class="px-3.5 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition text-gray-600">Préc.</button>
          <div class="flex gap-1">
            <button v-for="p in visiblePages" :key="p"
              @click="typeof p === 'number' && (currentPage = p)"
              :class="p === currentPage ? 'bg-primary text-white border-primary' : p === '...' ? 'border-transparent text-gray-400 cursor-default' : 'border-gray-200 text-gray-600 hover:border-gray-300'"
              class="w-8 h-8 rounded-xl border text-xs font-medium transition">{{ p }}</button>
          </div>
          <button @click="currentPage++" :disabled="currentPage === totalPages"
            class="px-3.5 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition text-gray-600">Suiv.</button>
          <button @click="currentPage = totalPages" :disabled="currentPage === totalPages"
            class="p-2 rounded-xl border border-gray-200 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition text-gray-500" title="Dernière page">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
          </button>
        </div>
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

            <!-- Titre & Image -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Titre</label>
              <input v-model="form.title" type="text" placeholder="Titre de l'info pratique"
                class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" required />
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Image de couverture</label>
              <div class="flex items-center gap-4">
                <div v-if="imagePreview" class="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                  <img :src="imagePreview" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 flex-shrink-0 bg-gray-50">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <input type="file" accept="image/*" @change="onImageChange"
                    class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition cursor-pointer" />
                  <p class="text-xs text-gray-400 mt-1">Formats acceptés : JPG, PNG, GIF</p>
                </div>
              </div>
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

            <!-- Catégorie + Auteur + Statut -->
            <div class="grid grid-cols-3 gap-3">
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
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Statut</label>
                <select v-model="form.status"
                  class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
                  <option value="published">Publié</option>
                  <option value="draft">Brouillon</option>
                  <option value="archived">Archivé</option>
                </select>
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
definePageMeta({ middleware: 'admin' })
useSeoMeta({ title: 'Infos Pratiques — Admin Faso Agri' })

const { isSuperAdmin } = useAdminAuth()

const COLLECTION = 'practical_infos'

const infos       = ref<any[]>([])
const loading     = ref(false)
const loadError   = ref('')
const search      = ref('')
const filterCategory = ref('')
const filterStatus = ref('')

const filteredInfos = computed(() =>
  infos.value.filter(i => {
    const term = search.value.toLowerCase()
    const matchSearch = !term ||
      (i.title ?? '').toLowerCase().includes(term) ||
      (i.author ?? '').toLowerCase().includes(term) ||
      (i.tags ?? []).some((t: string) => t.toLowerCase().includes(term))
    const matchCat = !filterCategory.value || i.category === filterCategory.value
    const matchStatus = !filterStatus.value || (i.status ?? 'published') === filterStatus.value
    return matchSearch && matchCat && matchStatus
  })
)

const PAGE_SIZE = 15
const currentPage = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(filteredInfos.value.length / PAGE_SIZE)))
const paginatedInfos = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredInfos.value.slice(start, start + PAGE_SIZE)
})
const visiblePages = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | string)[] = [1]
  if (cur > 3) pages.push('...')
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i)
  if (cur < total - 2) pages.push('...')
  pages.push(total)
  return pages
})
watch(filteredInfos, () => { currentPage.value = 1 })

// Editor modal
const editorOpen = ref(false)
const editingId  = ref<string | null>(null)
const saving     = ref(false)

const deleteModalOpen = ref(false)
const infoToDelete = ref<string | null>(null)
const deleting = ref(false)

const defaultForm = () => ({
  title: '',
  description: '',
  content: '',
  category: '',
  author: 'Administrateur',
  tagsInput: '',
  readMinutes: 3,
  status: 'published'
})
const form = reactive(defaultForm())

const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)

function onImageChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const res = reader.result as string
      resolve(res.includes(',') ? res.split(',')[1] : res)
    }
    reader.onerror = e => reject(e)
  })
}

async function openEditor(info?: any) {
  editingId.value = info?.id ?? null
  imagePreview.value = null
  imageFile.value = null

  if (info) {
    form.title       = info.title ?? ''
    form.description = info.description ?? ''
    form.content     = info.content ?? ''
    form.category    = info.category ?? ''
    form.author      = info.author ?? ''
    form.tagsInput   = (info.tags ?? []).join(', ')
    form.readMinutes = info.readMinutes ?? 3
    form.status      = info.status ?? 'published'

    if (info.hasImage && $firestore) {
      try {
        const { collection, getDocs, query, orderBy, limit } = await import('firebase/firestore')
        const snap = await getDocs(query(collection($firestore as any, COLLECTION, info.id, 'images'), orderBy('index'), limit(1)))
        if (!snap.empty) {
          imagePreview.value = 'data:image/jpeg;base64,' + snap.docs[0].data().b64
        }
      } catch(e) { console.error(e) }
    }
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

    let b64Image: string | null = null
    if (imageFile.value) {
      b64Image = await fileToBase64(imageFile.value)
    }

    const payload: any = {
      title:       form.title,
      description: form.description,
      content:     form.content,
      category:    form.category,
      author:      form.author,
      tags,
      readMinutes: form.readMinutes ?? 3,
      status:      form.status ?? 'published',
    }

    if (b64Image || imagePreview.value) {
       payload.hasImage = true
    } else {
       payload.hasImage = false
    }

    if ($firestore) {
      const { doc, updateDoc, addDoc, collection, getDocs, deleteDoc, serverTimestamp } = await import('firebase/firestore')
      const fs = $firestore as any
      let docId = editingId.value

      if (docId) {
        await updateDoc(doc(fs, COLLECTION, docId), { ...payload, updatedAt: serverTimestamp() })
        infos.value = infos.value.map(i => i.id === docId ? { ...i, ...payload } : i)
      } else {
        const ref = await addDoc(collection(fs, COLLECTION), { ...payload, createdAt: serverTimestamp() })
        docId = ref.id
        infos.value = [{ id: docId, ...payload, createdAt: new Date() }, ...infos.value]
      }

      if (b64Image && docId) {
        // Clear old images
        const imgs = await getDocs(collection(fs, COLLECTION, docId, 'images'))
        for (const d of imgs.docs) await deleteDoc(d.ref)
        // Add new image
        await addDoc(collection(fs, COLLECTION, docId, 'images'), { b64: b64Image, index: 0, createdAt: serverTimestamp() })
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

function askDeleteInfo(id: string) {
  if (!isSuperAdmin.value) return
  infoToDelete.value = id
  deleteModalOpen.value = true
}

async function confirmDeleteInfo() {
  if (!infoToDelete.value) return
  deleting.value = true
  try {
    if ($firestore) {
      const { doc, deleteDoc } = await import('firebase/firestore')
      await deleteDoc(doc($firestore as any, COLLECTION, infoToDelete.value))
    }
    infos.value = infos.value.filter(i => i.id !== infoToDelete.value)
    deleteModalOpen.value = false
  } catch (e: any) {
    console.error('[Infos Pratiques] Delete error:', e)
    alert("Erreur lors de la suppression : " + (e.message ?? 'erreur inconnue'))
  } finally {
    deleting.value = false
    infoToDelete.value = null
  }
}

function formatDate(ts: any) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function updateStatus(info: any, newStatus: 'published' | 'draft' | 'archived') {
  try {
    if ($firestore) {
      const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore')
      const fs = $firestore as any
      await updateDoc(doc(fs, COLLECTION, info.id), { status: newStatus, updatedAt: serverTimestamp() })
    }
    info.status = newStatus
  } catch (e: any) {
    console.error('[Infos Pratiques] Update status error:', e)
    alert("Erreur lors de la mise à jour du statut : " + (e.message ?? 'erreur inconnue'))
  }
}

function statusBadge(s: string) {
  const map: Record<string, string> = {
    published: 'bg-green-50 text-green-700 border border-green-200',
    draft: 'bg-gray-100 text-gray-500 border border-gray-200',
    archived: 'bg-red-50 text-red-700 border border-red-200'
  }
  return map[s] ?? 'bg-green-50 text-green-700 border border-green-200'
}

function statusLabel(s: string) {
  const map: Record<string, string> = {
    published: 'Publié',
    draft: 'Brouillon',
    archived: 'Archivé'
  }
  return map[s] ?? 'Publié'
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
