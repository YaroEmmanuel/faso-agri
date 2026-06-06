<template>
  <AdminLayout>
    <div class="space-y-5">

      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900">Utilisateurs</h1>
          <p class="text-sm text-gray-400 mt-0.5">{{ totalCount }} comptes enregistrés</p>
        </div>
        <button
          @click="exportCsv"
          class="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl px-4 py-2 hover:border-gray-300 transition"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Exporter CSV
        </button>
      </div>

      <!-- Filtres -->
      <div class="flex flex-wrap gap-3">
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher par nom ou email…"
          class="flex-1 min-w-52 px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
        />
        <select v-model="filterRegion" class="px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
          <option value="">Toutes les régions</option>
          <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
        </select>
        <select v-model="filterStatus" class="px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
          <option value="">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="disabled">Désactivé</option>
        </select>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div v-if="loading" class="p-6 space-y-3">
          <div v-for="i in 8" :key="i" class="h-10 bg-gray-100 rounded-xl animate-pulse" />
        </div>

        <table v-else class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
              <th class="text-left px-5 py-3 font-medium">Utilisateur</th>
              <th class="text-left px-5 py-3 font-medium hidden md:table-cell">Région</th>
              <th class="text-left px-5 py-3 font-medium hidden lg:table-cell">Inscription</th>
              <th class="text-left px-5 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition"
            >
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {{ initials(user.displayName) }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ user.displayName }}</p>
                    <p class="text-xs text-gray-400">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-3.5 text-gray-500 hidden md:table-cell">{{ user.region || '—' }}</td>
              <td class="px-5 py-3.5 text-gray-400 hidden lg:table-cell">{{ formatDate(user.createdAt) }}</td>
              <td class="px-5 py-3.5">
                <span :class="user.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'" class="text-xs px-2.5 py-1 rounded-full font-medium">
                  {{ user.status === 'active' ? 'Actif' : 'Désactivé' }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="4" class="px-5 py-10 text-center text-sm text-gray-400">Aucun utilisateur trouvé.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between text-sm text-gray-400">
        <span>Page {{ page }} · {{ filteredUsers.length }} résultats</span>
        <div class="flex gap-2">
          <button @click="prevPage" :disabled="page === 1" class="px-4 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600">Précédent</button>
          <button @click="nextPage" :disabled="!hasMore" class="px-4 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600">Suivant</button>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
const { $firestore } = useNuxtApp()
definePageMeta({ middleware: 'admin' })
useSeoMeta({ title: 'Utilisateurs — Admin Faso Agri' })

const PAGE_SIZE = 20
const regions = ['Centre','Hauts-Bassins','Cascades','Est','Nord','Centre-Nord','Centre-Ouest','Centre-Est','Boucle du Mouhoun','Sahel','Sud-Ouest','Plateau-Central','Centre-Sud']

const users      = ref<any[]>([])
const loading    = ref(false)
const page       = ref(1)
const hasMore    = ref(false)
const totalCount = ref(0)
const lastDoc    = ref<any>(null)
const search       = ref('')
const filterRegion = ref('')
const filterStatus = ref('')

const filteredUsers = computed(() =>
  users.value.filter(u => {
    const matchSearch = !search.value || u.displayName?.toLowerCase().includes(search.value.toLowerCase()) || u.email?.toLowerCase().includes(search.value.toLowerCase())
    const matchRegion = !filterRegion.value || u.region === filterRegion.value
    const matchStatus = !filterStatus.value || u.status === filterStatus.value
    return matchSearch && matchRegion && matchStatus
  })
)

function initials(name: string) { return name ? name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase() : '?' }
function formatDate(ts: any) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}


const fallbackUsers = Array.from({ length: 12 }, (_, i) => ({
  id: String(i), displayName: ['Moussa Traoré','Aïcha Koné','Ibrahim Sawadogo','Fatou Diallo','Adama Ouédraogo','Mariam Coulibaly','Seydou Kaboré','Aminata Tapsoba','Boubacar Zongo','Kadiatou Bâ','Lassina Dao','Rokia Sore'][i],
  email: `user${i+1}@fasoagri.bf`, region: regions[i % regions.length], status: i % 5 === 0 ? 'disabled' : 'active', createdAt: null
}))

async function fetchPage(after?: any) {
  if (!$firestore) {
    users.value = fallbackUsers
    totalCount.value = fallbackUsers.length
    hasMore.value = false
    return
  }
  loading.value = true
  try {
    const { collection, query, orderBy, limit, startAfter, getDocs, getCountFromServer } = await import('firebase/firestore')
    const fs = $firestore as any
    const constraints: any[] = [orderBy('createdAt', 'desc'), limit(PAGE_SIZE)]
    if (after) constraints.push(startAfter(after))
    const q    = query(collection(fs, 'users'), ...constraints)
    const snap = await getDocs(q)
    users.value  = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    hasMore.value = snap.docs.length === PAGE_SIZE
    lastDoc.value = snap.docs[snap.docs.length - 1] ?? null
    const countSnap = await getCountFromServer(collection(fs, 'users'))
    totalCount.value = countSnap.data().count
  } finally { loading.value = false }
}

async function nextPage() { if (!lastDoc.value) return; page.value++; await fetchPage(lastDoc.value) }
async function prevPage() { if (page.value <= 1) return; page.value--; await fetchPage() }

function exportCsv() {
  const headers = ['ID','Nom','Email','Région','Statut','Inscription']
  const rows = filteredUsers.value.map(u => [u.id, u.displayName, u.email, u.region, u.status, formatDate(u.createdAt)])
  const csv  = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a'); a.href = url; a.download = 'utilisateurs.csv'; a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => fetchPage())
</script>
