<template>
  <AdminLayout>
    <div class="space-y-5">

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-gray-900">Catalogue</h1>
          <p class="text-sm text-gray-400 mt-0.5">Produits agricoles et événements</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          v-for="tab in tabs" :key="tab.key"
          @click="activeTab = tab.key"
          :class="activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'"
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
          <option value="intrants">Intrants</option>
          <option value="semences">Semences</option>
          <option value="materiels">Matériels</option>
          <option value="recoltes">Produits récoltés</option>
        </select>
        <select v-model="filterStatus"
          class="px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
          <option value="">Tous les statuts</option>
          <option value="published">Publié</option>
          <option value="draft">Brouillon</option>
          <option value="archived">Archivé</option>
        </select>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div v-if="loading" class="p-6 space-y-3">
          <div v-for="i in 6" :key="i" class="h-14 bg-gray-100 rounded-xl animate-pulse" />
        </div>

        <table v-else class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
              <th class="text-left px-5 py-3 font-medium">{{ activeTab === 'products' ? 'Produit' : 'Événement' }}</th>
              <th class="text-left px-5 py-3 font-medium hidden md:table-cell">{{ activeTab === 'products' ? 'Catégorie' : 'Date' }}</th>
              <th class="text-left px-5 py-3 font-medium hidden lg:table-cell">Région</th>
              <th class="text-left px-5 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredItems" :key="item.id" class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition">
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    <img v-if="item.imageBase64" :src="`data:image/jpeg;base64,${item.imageBase64}`" class="w-full h-full object-cover" alt="" />
                    <svg v-else class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="font-medium text-gray-900 truncate">{{ item.name || item.title }}</p>
                    <p class="text-xs text-gray-400">{{ activeTab === 'products' ? item.price + ' FCFA' : item.location }}</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3.5 text-gray-500 hidden md:table-cell capitalize">{{ activeTab === 'products' ? (item.category || '—') : formatDate(item.date) }}</td>
              <td class="px-5 py-3.5 text-gray-400 hidden lg:table-cell">{{ item.region || '—' }}</td>
              <td class="px-5 py-3.5">
                <span :class="statusBadge(item.status)" class="text-xs px-2.5 py-1 rounded-full font-medium">{{ statusLabel(item.status) }}</span>
              </td>
            </tr>
            <tr v-if="filteredItems.length === 0">
              <td colspan="4" class="px-5 py-10 text-center text-sm text-gray-400">Aucun élément trouvé.</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
const { $firestore } = useNuxtApp()
definePageMeta({ middleware: 'admin' })
useSeoMeta({ title: 'Catalogue — Admin Faso Agri' })

const tabs = [{ key: 'products', label: 'Produits' }, { key: 'events', label: 'Événements' }]
const activeTab      = ref<'products' | 'events'>('products')
const search         = ref('')
const filterCategory = ref('')
const filterStatus   = ref('')
const loading = ref(false)
const items   = ref<any[]>([])

const collectionName = computed(() => activeTab.value === 'products' ? 'products' : 'events')

const filteredItems = computed(() => {
  const term = search.value.toLowerCase()
  return items.value.filter(i => {
    const text = (i.name || i.title || '').toLowerCase()
    const matchSearch = !term || text.includes(term)
    const matchCat    = !filterCategory.value || i.category === filterCategory.value
    const matchStatus = !filterStatus.value   || i.status   === filterStatus.value
    return matchSearch && matchCat && matchStatus
  })
})

function statusBadge(s: string) {
  const m: Record<string,string> = { published: 'bg-green-50 text-green-700', draft: 'bg-amber-50 text-amber-700', archived: 'bg-gray-100 text-gray-400', ended: 'bg-red-50 text-red-500' }
  return m[s] ?? 'bg-gray-100 text-gray-500'
}
function statusLabel(s: string) {
  const m: Record<string,string> = { published: 'Publié', draft: 'Brouillon', archived: 'Archivé', ended: 'Terminé' }
  return m[s] ?? s
}
function formatDate(ts: any) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

const fallbackProducts = [
  { id:'1', name:'Sacs d\'engrais NPK 50kg', category:'intrants', price:25000, region:'Centre', status:'published' },
  { id:'2', name:'Semences de sorgho certifiées', category:'semences', price:8000, region:'Sahel', status:'published' },
  { id:'3', name:'Houe manga améliorée', category:'materiels', price:15000, region:'Hauts-Bassins', status:'draft' },
  { id:'4', name:'Mil local — sac 100kg', category:'recoltes', price:18000, region:'Nord', status:'published' },
]
const fallbackEvents = [
  { id:'1', title:'Foire agricole de Bobo 2026', location:'Bobo-Dioulasso', region:'Hauts-Bassins', status:'published', date: null },
  { id:'2', title:'Formation irrigation — Koudougou', location:'Koudougou', region:'Centre-Ouest', status:'published', date: null },
]

async function loadItems() {
  if (!$firestore) {
    items.value = activeTab.value === 'products' ? fallbackProducts : fallbackEvents
    return
  }
  loading.value = true
  try {
    const { collection, query, orderBy, getDocs } = await import('firebase/firestore')
    const fs = $firestore as any
    const q  = query(collection(fs, collectionName.value), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    items.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } finally { loading.value = false }
}

watch(activeTab, () => { search.value = ''; filterCategory.value = ''; filterStatus.value = ''; loadItems() })
onMounted(loadItems)
</script>
