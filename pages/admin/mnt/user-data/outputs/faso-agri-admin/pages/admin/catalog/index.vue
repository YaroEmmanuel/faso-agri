<template>
  <AdminLayout>
    <div class="space-y-5">

      <!-- En-tête + onglets -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-xl font-semibold text-gray-900">Catalogue</h1>
          <p class="text-sm text-gray-400 mt-0.5">Produits agricoles et événements</p>
        </div>
        <NuxtLink
          :to="activeTab === 'products' ? '/admin/catalog/products/new' : '/admin/catalog/events/new'"
          class="inline-flex items-center gap-2 bg-primary text-white text-sm px-4 py-2 rounded-xl hover:opacity-90 transition"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Ajouter
        </NuxtLink>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="activeTab === tab.key
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-400 hover:text-gray-600'"
          class="px-5 py-1.5 rounded-lg text-sm font-medium transition"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Filtres -->
      <div class="flex flex-wrap gap-3">
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher…"
          class="flex-1 min-w-48 px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
        />
        <select
          v-if="activeTab === 'products'"
          v-model="filterCategory"
          class="px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
        >
          <option value="">Toutes les catégories</option>
          <option value="intrants">Intrants</option>
          <option value="semences">Semences</option>
          <option value="materiels">Matériels</option>
          <option value="recoltes">Produits récoltés</option>
        </select>
        <select
          v-model="filterStatus"
          class="px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
        >
          <option value="">Tous les statuts</option>
          <option value="published">Publié</option>
          <option value="draft">Brouillon</option>
          <option value="archived">Archivé</option>
        </select>
      </div>

      <!-- Liste -->
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
              <th class="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in filteredItems"
              :key="item.id"
              class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition"
            >
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <!-- Image ou placeholder -->
                  <div class="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                    <img
                      v-if="item.imageBase64"
                      :src="`data:image/jpeg;base64,${item.imageBase64}`"
                      class="w-full h-full object-cover"
                      alt=""
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-lg">
                      {{ activeTab === 'products' ? '🌾' : '📅' }}
                    </div>
                  </div>
                  <div class="min-w-0">
                    <p class="font-medium text-gray-900 truncate">{{ item.name || item.title }}</p>
                    <p class="text-xs text-gray-400">
                      {{ activeTab === 'products' ? item.price + ' FCFA' : item.location }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3.5 text-gray-500 hidden md:table-cell capitalize">
                {{ activeTab === 'products' ? (item.category || '—') : formatDate(item.date) }}
              </td>
              <td class="px-5 py-3.5 text-gray-400 hidden lg:table-cell">{{ item.region || '—' }}</td>
              <td class="px-5 py-3.5">
                <span :class="statusBadge(item.status)" class="text-xs px-2.5 py-1 rounded-full font-medium">
                  {{ statusLabel(item.status) }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-right">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink
                    :to="`/admin/catalog/${activeTab}/${item.id}`"
                    class="text-xs text-primary hover:underline"
                  >
                    Modifier
                  </NuxtLink>
                  <button
                    @click="archiveItem(item.id)"
                    class="text-xs text-gray-400 hover:text-red-500 transition"
                  >
                    Archiver
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredItems.length === 0">
              <td colspan="5" class="px-5 py-10 text-center text-sm text-gray-400">
                Aucun élément trouvé.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { collection, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore'

const { $firestore } = useNuxtApp()

definePageMeta({ middleware: 'admin' })
useSeoMeta({ title: 'Catalogue — Admin Faso Agri' })

const tabs = [
  { key: 'products', label: 'Produits' },
  { key: 'events',   label: 'Événements' },
]
const activeTab = ref<'products' | 'events'>('products')
const search = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const loading = ref(true)
const items = ref<any[]>([])

const collectionName = computed(() => activeTab.value === 'products' ? 'products' : 'events')

const filteredItems = computed(() => {
  const term = search.value.toLowerCase()
  return items.value.filter(i => {
    const text = (i.name || i.title || '').toLowerCase()
    const matchSearch = !term || text.includes(term)
    const matchCat = !filterCategory.value || i.category === filterCategory.value
    const matchStatus = !filterStatus.value || i.status === filterStatus.value
    return matchSearch && matchCat && matchStatus
  })
})

function statusBadge(status: string) {
  const map: Record<string, string> = {
    published: 'bg-green-50 text-green-700',
    draft:     'bg-yellow-50 text-yellow-700',
    archived:  'bg-gray-100 text-gray-400',
    ended:     'bg-red-50 text-red-500',
  }
  return map[status] ?? 'bg-gray-100 text-gray-500'
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    published: 'Publié', draft: 'Brouillon', archived: 'Archivé', ended: 'Terminé'
  }
  return map[status] ?? status
}

function formatDate(ts: any) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function loadItems() {
  loading.value = true
  try {
    const q = query(collection($firestore, collectionName.value), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    items.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } finally {
    loading.value = false
  }
}

async function archiveItem(id: string) {
  if (!confirm('Archiver cet élément ?')) return
  await updateDoc(doc($firestore, collectionName.value, id), { status: 'archived' })
  items.value = items.value.map(i => i.id === id ? { ...i, status: 'archived' } : i)
}

watch(activeTab, () => {
  search.value = ''
  filterCategory.value = ''
  filterStatus.value = ''
  loadItems()
})

onMounted(loadItems)
</script>
