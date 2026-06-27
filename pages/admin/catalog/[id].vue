<template>
  <AdminLayout>
    <div class="space-y-6 max-w-2xl">

      <!-- Back -->
      <NuxtLink to="/admin/catalog" class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Retour au Catalogue
      </NuxtLink>

      <!-- Skeleton -->
      <div v-if="loading" class="space-y-4">
        <div class="h-7 w-2/3 bg-gray-100 rounded animate-pulse" />
        <div class="h-4 w-1/3 bg-gray-100 rounded animate-pulse" />
        <div class="space-y-2 mt-6">
          <div v-for="i in 4" :key="i" class="h-3 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>

      <!-- Contenu -->
      <div v-else-if="item" class="space-y-4">
        <div class="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap mb-2">
                <span v-if="item.status" :class="statusBadge(item.status)" class="text-xs px-2.5 py-0.5 rounded-full font-medium">
                  {{ statusLabel(item.status) }}
                </span>
                <span v-if="item.category || item.type" class="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                  {{ item.category ? productCategoryLabel(item.category) : announcementTypeLabel(item.type) }}
                </span>
              </div>
              <h1 class="text-lg font-bold text-gray-900">{{ item.title ?? item.name ?? '(Sans titre)' }}</h1>
              <p class="text-sm text-gray-500 mt-1">
                <span v-if="item.authorName" class="font-medium">{{ item.authorName }}</span>
                <span v-if="item.authorName && (item.province || item.location)"> · </span>
                <span v-if="item.province || item.location">{{ item.province || item.location }}</span>
                <span v-if="item.price"> · <strong>{{ item.price }} FCFA</strong></span>
                · {{ formatDate(item.createdAt) }}
              </p>
            </div>
            <div class="flex gap-2 flex-shrink-0">
              <button @click="openEditor" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Modifier
              </button>
              <button @click="deleteItem" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-red-200 rounded-xl text-red-500 hover:bg-red-50 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Supprimer
              </button>
            </div>
          </div>

          <!-- Description -->
          <div v-if="item.description" class="pt-3 border-t border-gray-50">
            <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Description</h2>
            <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{{ item.description }}</p>
          </div>
        </div>
      </div>

      <!-- Not found -->
      <div v-else-if="!loading" class="text-center py-16 text-gray-400 text-sm">Élément introuvable.</div>

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
            <h2 class="font-semibold text-gray-900 text-sm">Modifier l'élément</h2>
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
              <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Description</label>
              <textarea v-model="form.description" rows="4" class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Prix (FCFA)</label>
                <input v-model="form.price" type="text" class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" />
              </div>
              <div v-if="isProduct">
                <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Catégorie</label>
                <select v-model="form.category" class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
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
                <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Type</label>
                <select v-model="form.type" class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
                  <option value="service">Service</option>
                  <option value="evenement">Événement</option>
                  <option value="formation">Formation</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Statut</label>
              <select v-model="form.status" class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
                <option value="active">Actif</option>
                <option value="published">Publié</option>
                <option value="draft">Brouillon</option>
                <option value="archived">Archivé</option>
                <option value="inactive">Inactif</option>
              </select>
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
const route  = useRoute()
const router = useRouter()
definePageMeta({ middleware: 'admin' })

const id = route.params.id as string

const item      = ref<any>(null)
const loading   = ref(false)
const loadError = ref('')
const editorOpen = ref(false)
const saving     = ref(false)

// Détecter si c'est un produit ou une annonce
const isProduct = computed(() => item.value && !item.value.type && !!item.value.category
  || (item.value && ['production_vegetale','production_animale','production_halieutique','intrants_agricoles','produits_veterinaires','aliments','equipements','autre'].includes(item.value.category)))
const collection_name = computed(() => isProduct.value ? 'products' : 'announcements')

const form = reactive({ title: '', description: '', price: '', category: '', type: '', status: 'active' })

function formatDate(ts: any) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function statusBadge(s: string) {
  const m: Record<string,string> = { active: 'bg-green-50 text-green-700', published: 'bg-green-50 text-green-700', draft: 'bg-amber-50 text-amber-700', archived: 'bg-gray-100 text-gray-400', inactive: 'bg-red-50 text-red-500' }
  return m[s] ?? 'bg-gray-100 text-gray-500'
}
function statusLabel(s: string) {
  const m: Record<string,string> = { active: 'Actif', published: 'Publié', draft: 'Brouillon', archived: 'Archivé', inactive: 'Inactif' }
  return m[s] ?? s
}
function productCategoryLabel(cat: string) {
  const m: Record<string,string> = { production_vegetale: 'Production végétale', production_animale: 'Production animale', production_halieutique: 'Production halieutique', intrants_agricoles: 'Intrants agricoles', produits_veterinaires: 'Produits vétérinaires', aliments: 'Aliments', equipements: 'Équipements', autre: 'Autre' }
  return m[cat] ?? cat ?? '—'
}
function announcementTypeLabel(type: string) {
  const m: Record<string,string> = { service: 'Service', evenement: 'Événement', formation: 'Formation', autre: 'Autre' }
  return m[type] ?? type ?? '—'
}

function openEditor() {
  form.title       = item.value?.title ?? item.value?.name ?? ''
  form.description = item.value?.description ?? ''
  form.price       = String(item.value?.price ?? '')
  form.category    = item.value?.category ?? ''
  form.type        = item.value?.type ?? ''
  form.status      = item.value?.status ?? 'active'
  editorOpen.value = true
}

async function saveEdit() {
  saving.value = true
  try {
    const payload: any = { title: form.title, description: form.description, price: form.price, status: form.status }
    if (isProduct.value) payload.category = form.category
    else payload.type = form.type

    if ($firestore) {
      const { doc, updateDoc } = await import('firebase/firestore')
      // Try both collections
      try {
        await updateDoc(doc($firestore as any, 'products', id), payload)
      } catch {
        await updateDoc(doc($firestore as any, 'announcements', id), payload)
      }
    }
    Object.assign(item.value, payload)
    editorOpen.value = false
  } catch (e: any) {
    alert('Erreur : ' + (e.message ?? 'inconnue'))
  } finally {
    saving.value = false
  }
}

async function deleteItem() {
  if (!confirm('Supprimer cet élément définitivement ?')) return
  try {
    if ($firestore) {
      const { doc, deleteDoc } = await import('firebase/firestore')
      try { await deleteDoc(doc($firestore as any, 'products', id)) }
      catch { await deleteDoc(doc($firestore as any, 'announcements', id)) }
    }
    router.push('/admin/catalog')
  } catch (e: any) {
    alert('Erreur : ' + (e.message ?? 'inconnue'))
  }
}

onMounted(async () => {
  if (!$firestore) { loadError.value = 'Firebase non configuré.'; return }
  loading.value = true
  try {
    const { doc, getDoc } = await import('firebase/firestore')
    // Essayer products d'abord, puis announcements
    let snap = await getDoc(doc($firestore as any, 'products', id))
    if (!snap.exists()) {
      snap = await getDoc(doc($firestore as any, 'announcements', id))
    }
    if (snap.exists()) {
      item.value = { id: snap.id, ...snap.data() }
    }
  } catch (e: any) {
    loadError.value = e?.message ?? 'Erreur de chargement.'
  } finally {
    loading.value = false
  }
})

useSeoMeta({ title: computed(() => (item.value?.title ?? 'Élément') + ' — Admin Faso Agri') })
</script>
