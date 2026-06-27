<template>
  <AdminLayout>
    <div class="space-y-5">

      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900">Utilisateurs</h1>
          <p class="text-sm text-gray-400 mt-0.5">Gestion des membres de la communauté</p>
        </div>
        <div class="flex items-center gap-3">
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
      </div>

      <!-- Filtres -->
      <div class="flex flex-wrap gap-3">
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher par nom, email ou téléphone…"
          class="flex-1 min-w-52 px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
        />
        <select v-model="filterRegion" class="px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
          <option value="">Toutes les provinces</option>
          <option v-for="r in BURKINA_PROVINCES" :key="r" :value="r">{{ r }}</option>
        </select>
        <select v-model="filterRole" class="px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
          <option value="">Tous les rôles</option>
          <option value="admin">Administrateur</option>
          <option value="professionnel_agricole">Fermier</option>
          <option value="veterinaire">Vétérinaire</option>
          <option value="vendeur_intrants">Vendeur d'intrants</option>
          <option value="technicien_agricole">Technicien Agricole</option>
        </select>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
        <div v-if="loading" class="p-6 space-y-3">
          <div v-for="i in 8" :key="i" class="h-10 bg-gray-100 rounded-xl animate-pulse" />
        </div>

        <table v-else class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50/50 text-xs text-gray-400 uppercase tracking-wider">
              <th class="text-left px-6 py-3.5 font-semibold">Utilisateur</th>
              <th class="text-left px-6 py-3.5 font-semibold hidden md:table-cell">Province</th>
              <th class="text-left px-6 py-3.5 font-semibold hidden lg:table-cell">Rôle</th>
              <th class="text-left px-6 py-3.5 font-semibold hidden lg:table-cell">Inscription</th>
              <th class="text-left px-6 py-3.5 font-semibold">Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="border-b border-gray-100/50 last:border-0 hover:bg-gray-50/40 transition"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div v-if="user.avatarUrl" class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <img :src="user.avatarUrl" :alt="user.fullName" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {{ getAdminInitials(user.fullName) }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ user.fullName }}</p>
                    <p class="text-xs text-gray-400">{{ user.email || user.phone || '—' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-gray-500 hidden md:table-cell">{{ user.residence || '—' }}</td>
              <td class="px-6 py-4 hidden lg:table-cell">
                <span :class="roleClass(user.role)" class="text-xs px-2 py-0.5 rounded-full font-medium">{{ roleLabel(user.role) }}</span>
              </td>
              <td class="px-6 py-4 text-gray-400 hidden lg:table-cell">{{ formatAdminDate(user.createdAt) }}</td>
              <td class="px-6 py-4">
                <span
                  :class="user.status === 'disabled' ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-green-700'"
                  class="text-xs px-2.5 py-1 rounded-full font-medium"
                >
                  {{ user.status === 'disabled' ? 'Désactivé' : 'Actif' }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="5" class="px-6 py-10 text-center text-sm text-gray-400">Aucun utilisateur trouvé.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Error -->
      <div v-if="loadError" class="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-700">
        ⚠️ {{ loadError }}
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between text-sm text-gray-400">
        <span>Page {{ page }} · {{ filteredUsers.length }} résultats affichés sur {{ totalCount }}</span>
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
const users      = ref<any[]>([])
const loading    = ref(false)
const page       = ref(1)
const hasMore    = ref(false)
const totalCount = ref(0)
const lastDoc    = ref<any>(null)
const loadError  = ref('')

const search       = ref('')
const filterRegion = ref('')
const filterRole   = ref('')

// Map Flutter user fields → display-friendly object
function mapUser(id: string, data: any) {
  const firstName = data.firstName ?? ''
  const lastName  = data.lastName  ?? ''
  const fullName  = (data.displayName ?? `${firstName} ${lastName}`).trim() || '(Sans nom)'
  return {
    id,
    fullName,
    email:     data.email     ?? '',
    phone:     data.phone     ?? '',
    residence: data.residence ?? data.region ?? '',
    role:      data.role      ?? 'professionnel_agricole',
    status:    data.status    ?? 'active',
    avatarUrl: data.avatarUrl ?? null,
    createdAt: data.createdAt ?? null,
  }
}

const filteredUsers = computed(() =>
  users.value.filter(u => {
    const term = search.value.toLowerCase()
    const matchSearch = !term ||
      u.fullName.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.phone.includes(term)
    const matchRegion = !filterRegion.value || u.residence === filterRegion.value
    const matchRole   = !filterRole.value   || u.role === filterRole.value
    return matchSearch && matchRegion && matchRole
  })
)

function roleLabel(role: string) {
  const m: Record<string,string> = {
    admin: 'Administrateur',
    professionnel_agricole: 'Fermier',
    veterinaire: 'Vétérinaire',
    vendeur_intrants: "Vendeur d'intrants",
    technicien_agricole: 'Technicien Agricole'
  }
  return m[role] ?? role ?? 'Fermier'
}

function roleClass(role: string) {
  const m: Record<string,string> = {
    admin: 'bg-purple-50 text-purple-700',
    professionnel_agricole: 'bg-green-50 text-green-700',
    veterinaire: 'bg-blue-50 text-blue-700',
    vendeur_intrants: 'bg-amber-50 text-amber-700',
    technicien_agricole: 'bg-teal-50 text-teal-700',
  }
  return m[role] ?? 'bg-gray-100 text-gray-500'
}

async function fetchPage(after?: any) {
  if (!$firestore) {
    loadError.value = 'Firebase non configuré.'
    return
  }
  loadError.value = ''
  loading.value = true
  try {
    const { collection, query, orderBy, limit, startAfter, getDocs, getCountFromServer } = await import('firebase/firestore')
    const fs = $firestore as any
    const constraints: any[] = [orderBy('createdAt', 'desc'), limit(PAGE_SIZE)]
    if (after) constraints.push(startAfter(after))
    const q    = query(collection(fs, 'users'), ...constraints)
    const snap = await getDocs(q)
    users.value   = snap.docs.map(d => mapUser(d.id, d.data()))
    hasMore.value = snap.docs.length === PAGE_SIZE
    lastDoc.value = snap.docs[snap.docs.length - 1] ?? null
    const countSnap  = await getCountFromServer(collection(fs, 'users'))
    totalCount.value = countSnap.data().count
  } catch (e: any) {
    console.error('[Users]', e)
    loadError.value = e?.message ?? 'Erreur lors du chargement des utilisateurs.'
  } finally {
    loading.value = false
  }
}

async function nextPage() { if (!lastDoc.value) return; page.value++; await fetchPage(lastDoc.value) }
async function prevPage() { if (page.value <= 1) return; page.value--; await fetchPage() }

function exportCsv() {
  const headers = ['ID','Nom complet','Email','Téléphone','Province','Rôle','Statut','Inscription']
  const rows = filteredUsers.value.map(u => [u.id, u.fullName, u.email, u.phone, u.residence, u.role, u.status, formatAdminDate(u.createdAt)])
  const csv  = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a'); a.href = url; a.download = 'utilisateurs.csv'; a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => fetchPage())
</script>
