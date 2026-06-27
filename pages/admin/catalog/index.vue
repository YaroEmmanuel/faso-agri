<template>
  <AdminLayout>
    <div class="space-y-5">

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-gray-900">Catalogue</h1>
          <p class="text-sm text-gray-400 mt-0.5">Marché agricole et événements</p>
        </div>
        <button
          @click="exportCsv"
          class="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 rounded-xl transition w-fit"
        >
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Exporter en CSV
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 bg-slate-100/70 p-1 rounded-xl w-fit border border-slate-200/40">
        <button
          v-for="tab in tabs" :key="tab.key"
          @click="activeTab = tab.key"
          :class="activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'"
          class="px-5 py-1.5 rounded-lg text-sm font-medium transition"
        >{{ tab.label }}</button>
      </div>

      <!-- Filtres -->
      <div class="flex flex-wrap gap-3">
        <input v-model="search" type="text" placeholder="Rechercher…"
          class="flex-1 min-w-48 px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" />
        <select v-if="activeTab === 'products'" v-model="filterCategory"
          class="px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
          <option value="">Toutes les catégories</option>
          <option value="production_vegetale">Production végétale</option>
          <option value="production_animale">Production animale</option>
          <option value="production_halieutique">Production halieutique</option>
          <option value="intrants_agricoles">Intrants agricoles</option>
          <option value="produits_veterinaires">Produits vétérinaires</option>
          <option value="aliments">Aliments</option>
          <option value="equipements">Équipements</option>
          <option value="autre">Autre</option>
        </select>
        <select v-model="filterStatus"
          class="px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="published">Publié</option>
          <option value="draft">Brouillon</option>
          <option value="archived">Archivé</option>
          <option value="inactive">Inactif</option>
        </select>
        <select v-model="filterProvince"
          class="px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
          <option value="">Toutes les provinces</option>
          <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
        </select>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
        <div v-if="loading" class="p-6 space-y-3">
          <div v-for="i in 6" :key="i" class="h-14 bg-gray-100 rounded-xl animate-pulse" />
        </div>

        <table v-else class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50/50 text-xs text-gray-400 uppercase tracking-wider">
              <th class="text-left px-6 py-3.5 font-semibold">{{ activeTab === 'products' ? 'Marché Agricole' : 'Événement' }}</th>
              <th class="text-left px-6 py-3.5 font-semibold hidden md:table-cell">{{ activeTab === 'products' ? 'Catégorie' : 'Type' }}</th>
              <th class="text-left px-6 py-3.5 font-semibold hidden lg:table-cell">Province / Lieu</th>
              <th class="text-left px-6 py-3.5 font-semibold hidden lg:table-cell">Auteur</th>
              <th class="text-left px-6 py-3.5 font-semibold">Statut</th>
              <th class="text-right px-6 py-3.5 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredItems" :key="item.id" class="border-b border-gray-100/50 last:border-0 hover:bg-gray-50/40 transition">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center border border-gray-100/80">
                    <img v-if="item.imageBase64" :src="`data:image/jpeg;base64,${item.imageBase64}`" class="w-full h-full object-cover" alt="" />
                    <svg v-else class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="font-medium text-gray-900 truncate">{{ item.title }}</p>
                    <p class="text-xs text-gray-400">{{ item.price ? item.price + ' FCFA' : formatDate(item.createdAt) }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-gray-500 hidden md:table-cell">
                {{ activeTab === 'products' ? productCategoryLabel(item.category) : announcementTypeLabel(item.type) }}
              </td>
              <td class="px-6 py-4 text-gray-400 hidden lg:table-cell">{{ item.province || item.location || '—' }}</td>
              <td class="px-6 py-4 text-gray-400 hidden lg:table-cell">{{ item.authorName || '—' }}</td>
              <td class="px-6 py-4">
                <span :class="statusBadge(item.status)" class="text-xs px-2.5 py-1 rounded-full font-medium">{{ statusLabel(item.status) }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button @click="openEditor(item)" title="Modifier" class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button @click="deleteItem(item)" title="Supprimer" class="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredItems.length === 0">
              <td colspan="6" class="px-6 py-10 text-center text-sm text-gray-400">Aucun élément trouvé.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Error -->
      <div v-if="loadError" class="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-700">
        ⚠️ {{ loadError }}
      </div>

      <!-- Modal d'édition Catalogue (Produits/Annonces) -->
      <div v-if="editorOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div @click="closeEditor" class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" />

        <!-- Card Modal -->
        <div class="relative bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-10 flex flex-col max-h-[90vh]">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 class="text-base font-semibold text-slate-900">
              Modifier {{ activeTab === 'products' ? 'le produit' : "l'annonce" }}
            </h3>
            <button @click="closeEditor" class="text-slate-400 hover:text-slate-600 transition">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Content -->
          <form @submit.prevent="saveItem" class="flex-1 overflow-y-auto p-6 space-y-4">
            
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Titre / Nom</label>
              <input
                v-model="editForm.title"
                type="text"
                class="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                required
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Description</label>
              <textarea
                v-model="editForm.description"
                rows="4"
                class="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
                required
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Prix (FCFA)</label>
                <input
                  v-model="editForm.price"
                  type="text"
                  class="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>
              
              <div v-if="activeTab === 'products'">
                <label class="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Catégorie</label>
                <select
                  v-model="editForm.category"
                  class="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  required
                >
                  <option value="production_vegetale">Production végétale</option>
                  <option value="production_animale">Production animale</option>
                  <option value="production_halieutique">Production halieutique</option>
                  <option value="intrants_agricoles">Intrants agricoles</option>
                  <option value="produits_veterinaires">Produits vétérinaires</option>
                  <option value="aliments">Aliments</option>
                  <option value="equipements">Équipements</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div v-else>
                <label class="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Type</label>
                <select
                  v-model="editForm.type"
                  class="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  required
                >
                  <option value="service">Service</option>
                  <option value="evenement">Événement</option>
                  <option value="formation">Formation</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">
                  {{ activeTab === 'products' ? 'Province' : 'Lieu' }}
                </label>
                <select
                  v-model="editForm.province"
                  class="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  required
                >
                  <option value="" disabled>Sélectionner...</option>
                  <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Statut</label>
                <select
                  v-model="editForm.status"
                  class="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  required
                >
                  <option value="active">Actif</option>
                  <option value="published">Publié</option>
                  <option value="draft">Brouillon</option>
                  <option value="archived">Archivé</option>
                  <option value="inactive">Inactif</option>
                  <option value="ended">Terminé</option>
                </select>
              </div>
            </div>

            <!-- Footer buttons -->
            <div class="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                @click="closeEditor"
                class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-primary hover:opacity-90 rounded-xl transition"
              >
                Enregistrer
              </button>
            </div>

          </form>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
const { $firestore } = useNuxtApp()
definePageMeta({ middleware: 'admin' })
useSeoMeta({ title: 'Catalogue — Admin Faso Agri' })

function productCategoryLabel(cat: string) {
  const m: Record<string, string> = {
    production_vegetale: 'Production végétale',
    production_animale: 'Production animale',
    production_halieutique: 'Production halieutique',
    intrants_agricoles: 'Intrants agricoles',
    produits_veterinaires: 'Produits vétérinaires',
    aliments: 'Aliments',
    equipements: 'Équipements',
    autre: 'Autre'
  }
  return m[cat] ?? cat ?? '—'
}

function announcementTypeLabel(type: string) {
  const m: Record<string, string> = {
    service: 'Service',
    evenement: 'Événement',
    formation: 'Formation',
    autre: 'Autre'
  }
  return m[type] ?? type ?? '—'
}

const editorOpen = ref(false)
const editingItem = ref<any>(null)

const editForm = reactive({
  title: '',
  description: '',
  price: '',
  category: '',
  type: '',
  province: '',
  status: 'active'
})

function openEditor(item: any) {
  editingItem.value = item
  editForm.title = item.title || item.name || ''
  editForm.description = item.description || ''
  editForm.price = String(item.price ?? '')
  editForm.category = item.category || ''
  editForm.type = item.type || ''
  editForm.province = item.province || item.location || ''
  editForm.status = item.status || 'active'
  editorOpen.value = true
}

function closeEditor() {
  editorOpen.value = false
  editingItem.value = null
}

async function saveItem() {
  if (!editingItem.value) return
  
  const col = activeTab.value === 'products' ? 'products' : 'announcements'
  const payload: any = {
    title: editForm.title,
    description: editForm.description,
    price: editForm.price,
    status: editForm.status
  }

  if (activeTab.value === 'products') {
    payload.category = editForm.category
    payload.province = editForm.province
  } else {
    payload.type = editForm.type
    payload.location = editForm.province
  }

  try {
    if ($firestore) {
      const { doc, updateDoc } = await import('firebase/firestore')
      const fs = $firestore as any
      await updateDoc(doc(fs, col, editingItem.value.id), payload)
    }

    // Mettre à jour l'état local
    items.value = items.value.map(i => {
      if (i.id === editingItem.value.id) {
        return { ...i, ...payload }
      }
      return i
    })
    closeEditor()
  } catch (e) {
    console.error('[Save Item Error]', e)
    alert("Une erreur est survenue lors de la modification de l'élément.")
  }
}

async function deleteItem(item: any) {
  if (!confirm(`Supprimer définitivement cet élément (${item.title || 'sans titre'}) ?`)) return
  try {
    if ($firestore) {
      const { doc, deleteDoc } = await import('firebase/firestore')
      const fs = $firestore as any
      const col = activeTab.value === 'products' ? 'products' : 'announcements'
      await deleteDoc(doc(fs, col, item.id))
    }
    items.value = items.value.filter(i => i.id !== item.id)
  } catch (e) {
    console.error('[Delete Item Error]', e)
    alert("Une erreur est survenue lors de la suppression.")
  }
}

const regions = [
  "Ouagadougou (Kadiogo)", "Bobo-Dioulasso (Houet)", "Koudougou (Boulkiemdé)", 
  "Ouahigouya (Yatenga)", "Kaya (Sanmatenga)", "Banfora (Comoé)", 
  "Dédougou (Mouhoun)", "Tenkodogo (Boulgou)", "Fada N'Gourma (Gourma)", 
  "Dori (Séno)", "Gaoua (Poni)", "Manga (Zoundwéogo)", "Ziniaré (Oubritenga)",
  "Koupéla (Kouritenga)", "Léo (Sissili)", "Orodara (Kénédougou)",
  "Houndé (Tuy)", "Diébougou (Bougouriba)", "Nouna (Kossi)", "Tougan (Sourou)",
  "Kongoussi (Bam)", "Gourcy (Zondoma)", "Boussé (Kourwéogo)", "Zorgho (Ganzourgou)",
  "Pô (Nahouri)", "Bogandé (Gnagna)", "Diapaga (Tapoa)", "Toma (Nayala)",
  "Boromo (Balé)", "Réo (Sanguié)", "Kombissiri (Bazèga)", "Sapouy (Ziro)",
  "Sindou (Léraba)", "Batié (Noumbiel)", "Sebba (Yagha)", "Gayéri (Komondjari)",
  "Djibo (Soum)", "Gorom-Gorom (Oudalan)", "Yako (Passoré)", "Pama (Kompienga)",
  "Dano (Ioba)", "Solenzo (Banwa)", "Boulsa (Namentenga)", "Titao (Loroum)",
  "Ouargaye (Koulpélogo)"
]

// Products = 'products' collection (Flutter model: Product)
// Announcements = 'announcements' collection (Flutter model: Announcement) used as "events/offers"
const tabs = [
  { key: 'products',      label: 'Marché agricole' },
  { key: 'announcements', label: 'Événements' },
]

const activeTab      = ref<'products' | 'announcements'>('products')
const search         = ref('')
const filterCategory = ref('')
const filterStatus   = ref('')
const filterProvince = ref('')
const loading        = ref(false)
const loadError      = ref('')
const items          = ref<any[]>([])

const filteredItems = computed(() => {
  const term = search.value.toLowerCase()
  return items.value.filter(i => {
    const text = (i.title ?? '').toLowerCase()
    const matchSearch   = !term               || text.includes(term)
    const matchCat      = !filterCategory.value || i.category === filterCategory.value
    const matchStatus   = !filterStatus.value   || i.status   === filterStatus.value
    const matchProvince = !filterProvince.value  || i.province === filterProvince.value || i.location === filterProvince.value
    return matchSearch && matchCat && matchStatus && matchProvince
  })
})

function statusBadge(s: string) {
  const m: Record<string,string> = {
    active:    'bg-green-50 text-green-700',
    published: 'bg-green-50 text-green-700',
    draft:     'bg-amber-50 text-amber-700',
    archived:  'bg-gray-100 text-gray-400',
    inactive:  'bg-red-50 text-red-500',
    ended:     'bg-red-50 text-red-500',
  }
  return m[s] ?? 'bg-gray-100 text-gray-500'
}
function statusLabel(s: string) {
  const m: Record<string,string> = { active: 'Actif', published: 'Publié', draft: 'Brouillon', archived: 'Archivé', inactive: 'Inactif', ended: 'Terminé' }
  return m[s] ?? s ?? '—'
}
function formatDate(ts: any) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function loadItems() {
  if (!$firestore) {
    loadError.value = 'Firebase non configuré.'
    return
  }
  loadError.value = ''
  loading.value = true
  try {
    const { collection, query, orderBy, getDocs } = await import('firebase/firestore')
    const fs  = $firestore as any
    const col = activeTab.value === 'products' ? 'products' : 'announcements'
    const q   = query(collection(fs, col), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    items.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (e: any) {
    console.error('[Catalogue]', e)
    loadError.value = e?.message ?? 'Erreur lors du chargement du catalogue.'
    items.value = []
  } finally {
    loading.value = false
  }
}

function exportCsv() {
  const isProducts = activeTab.value === 'products'
  const filename   = isProducts ? 'marche-agricole.csv' : 'evenements.csv'
  const headers = isProducts
    ? ['Titre', 'Catégorie', 'Province', 'Prix', 'Statut', 'Description', 'Date']
    : ['Titre', 'Type', 'Province', 'Statut', 'Description', 'Date']
  const rows = filteredItems.value.map(i => isProducts
    ? [i.title ?? '', i.category ?? '', i.province ?? i.location ?? '', i.price ?? '', statusLabel(i.status ?? ''), i.description ?? '', formatDate(i.createdAt)]
    : [i.title ?? '', i.type ?? '', i.province ?? i.location ?? '', statusLabel(i.status ?? ''), i.description ?? '', formatDate(i.createdAt)]
  )
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a'); a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

watch(activeTab, () => { search.value = ''; filterCategory.value = ''; filterStatus.value = ''; filterProvince.value = ''; loadItems() })
onMounted(() => {
  loadItems()
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeEditor()
    }
  }
  window.addEventListener('keydown', handleKeyDown)
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
})
</script>
