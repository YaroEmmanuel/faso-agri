<template>
  <div class="min-h-screen bg-[#F8F9FB] flex">

    <!-- Sidebar -->
    <aside
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      class="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300"
    >
      <!-- Logo -->
      <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="/images/logo.png" alt="Logo Faso Agri" class="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
          <div>
            <p class="text-sm font-semibold text-gray-900 leading-none">Faso Agri</p>
            <p class="text-[10px] text-gray-400 mt-0.5">Administration</p>
          </div>
        </div>
        <button @click="sidebarOpen = false" class="text-gray-400 hover:text-gray-600 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-5 space-y-0.5">
        <p class="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Menu</p>
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group"
          :class="isActive(item.to)
            ? 'bg-primary text-white shadow-sm shadow-primary/20'
            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'"
        >
          <component :is="item.icon" class="w-[18px] h-[18px] flex-shrink-0" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- User footer -->
      <div class="px-4 py-4 border-t border-gray-100">
        <div @click="openProfileModal" class="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition group cursor-pointer">
          <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
            {{ adminInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold text-gray-800 truncate">{{ adminName }}</p>
            <p class="text-[10px] text-gray-400 truncate">{{ adminEmail }}</p>
          </div>
          <button
            @click.stop="handleSignOut"
            title="Déconnexion"
            class="text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-100 flex-shrink-0"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Overlay mobile -->
    <div v-if="sidebarOpen" @click="sidebarOpen = false" class="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden" />

    <!-- Main content -->
    <div
      class="flex-1 flex flex-col min-w-0 transition-all duration-300"
      :class="sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'"
    >

      <!-- Top bar -->
      <header class="bg-white border-b border-gray-100 px-5 py-3.5 flex items-center justify-between sticky top-0 z-10">
        <div class="flex items-center gap-3">
          <button @click="sidebarOpen = !sidebarOpen" class="text-gray-500 hover:text-gray-800 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <div>
            <h1 class="text-sm font-semibold text-gray-900">{{ pageTitle }}</h1>
            <p class="text-xs text-gray-400 hidden sm:block">{{ pageDate }}</p>
          </div>
        </div>
      </header>

    <!-- Modal Modifier le Profil -->
    <Teleport to="body">
      <div
        v-if="showProfileModal"
        class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="showProfileModal = false"
      >
        <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <h2 class="font-semibold text-gray-900 text-sm">Modifier mes informations</h2>
            <button @click="showProfileModal = false" class="text-gray-400 hover:text-gray-600 transition">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Body -->
          <form @submit.prevent="saveProfile" class="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            <!-- Nom complet -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Nom complet</label>
              <input
                v-model="profileForm.displayName"
                type="text"
                class="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                required
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Adresse Email</label>
              <input
                v-model="profileForm.email"
                type="email"
                class="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                required
              />
            </div>

            <!-- Téléphone -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Téléphone</label>
              <input
                v-model="profileForm.phone"
                type="tel"
                class="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
            </div>

            <!-- Lieu de résidence -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Province de Résidence</label>
              <select
                v-model="profileForm.residence"
                class="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              >
                <option value="">Sélectionner une province</option>
                <option v-for="r in provinces" :key="r" :value="r">{{ r }}</option>
              </select>
            </div>

            <!-- Mot de passe -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Nouveau Mot de Passe (laisser vide pour ne pas changer)</label>
              <input
                v-model="profileForm.password"
                type="password"
                placeholder="••••••••"
                class="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                minlength="6"
              />
            </div>

            <!-- Success / Error alerts -->
            <div v-if="profileError" class="text-xs text-red-600 bg-red-50 rounded-xl px-4 py-2.5">
              ⚠️ {{ profileError }}
            </div>
            <div v-if="profileSuccess" class="text-xs text-green-700 bg-green-50 rounded-xl px-4 py-2.5">
              ✓ {{ profileSuccess }}
            </div>

            <!-- Footer Buttons inside Form -->
            <div class="pt-4 border-t border-gray-100 flex items-center gap-3">
              <button
                type="button"
                @click="showProfileModal = false"
                class="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                :disabled="profileSaving"
                class="flex-1 px-4 py-2 text-sm bg-primary text-white rounded-xl hover:opacity-90 transition disabled:opacity-50"
              >
                <span v-if="!profileSaving">Enregistrer</span>
                <span v-else class="flex items-center justify-center gap-2">
                  <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Enregistrement...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

      <!-- Page slot -->
      <main class="flex-1 p-5 lg:p-7">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'

// ── SVG Icon components ──────────────────────────────────────────────────────
const IconDashboard = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.75',
      d: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z' })
  ])
})

const IconUsers = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.75',
      d: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' })
  ])
})

const IconCatalog = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.75',
      d: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2' })
  ])
})

const IconForum = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.75',
      d: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' })
  ])
})

const IconPublications = defineComponent({
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.75',
      d: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2zM13 4v6h6M9 13h6M9 17h4' })
  ])
})

// ── State ────────────────────────────────────────────────────────────────────
const { $auth, $firestore } = useNuxtApp()
const router       = useRouter()
const currentRoute = useRoute()
const sidebarOpen  = ref(true)

const navItems = [
  { to: '/admin',              icon: IconDashboard,   label: 'Tableau de bord' },
  { to: '/admin/users',        icon: IconUsers,       label: 'Utilisateurs' },
  { to: '/admin/catalog',      icon: IconCatalog,     label: 'Catalogue' },
  { to: '/admin/forum',        icon: IconForum,       label: 'Forum' },
  { to: '/admin/publications', icon: IconPublications, label: 'Infos Pratiques' },
]

function isActive(to: string) {
  if (to === '/admin') return currentRoute.path === '/admin'
  return currentRoute.path.startsWith(to)
}

// Page title based on active route
const pageTitle = computed(() => {
  const item = navItems.find(n => isActive(n.to))
  return item?.label ?? 'Administration'
})

const pageDate = computed(() =>
  new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
)

const auth = $auth as any
const currentUserData = ref<any>(null)

onMounted(async () => {
  // Ajuster sidebarOpen par défaut selon la taille de l'écran à l'initialisation
  if (process.client) {
    sidebarOpen.value = window.innerWidth >= 1024
  }

  if (auth?.currentUser && $firestore) {
    const { doc, getDoc } = await import('firebase/firestore')
    try {
      const snap = await getDoc(doc($firestore as any, 'users', auth.currentUser.uid))
      if (snap.exists()) {
        currentUserData.value = snap.data()
      }
    } catch (e) {
      console.error('[AdminLayout] Load user profile error:', e)
    }
  }

  // Écouter la touche Échap pour fermer le modal
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      showProfileModal.value = false
    }
  }
  window.addEventListener('keydown', handleKeyDown)
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
})

const adminName = computed(() => {
  if (currentUserData.value?.displayName) return currentUserData.value.displayName
  if (currentUserData.value?.firstName || currentUserData.value?.lastName) {
    return `${currentUserData.value.firstName ?? ''} ${currentUserData.value.lastName ?? ''}`.trim()
  }
  return auth?.currentUser?.displayName ?? 'Admin Démo'
})

const adminEmail = computed(() => {
  return currentUserData.value?.email ?? auth?.currentUser?.email ?? 'demo@fasoagri.bf'
})

const adminInitials = computed(() => {
  return adminName.value
    ? adminName.value.split(' ').map((w: string) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
    : 'AD'
})

async function handleSignOut() {
  if (auth) {
    const { signOut } = await import('firebase/auth')
    await signOut(auth)
  }
  await router.push('/admin/login')
}

// ── Profile Modal Logic ──────────────────────────────────────────────────────
const showProfileModal = ref(false)
const profileSaving = ref(false)
const profileError = ref('')
const profileSuccess = ref('')
const provinces = [
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

const profileForm = reactive({
  displayName: '',
  email: '',
  phone: '',
  residence: '',
  password: ''
})

function openProfileModal() {
  profileForm.displayName = adminName.value
  profileForm.email = adminEmail.value
  profileForm.phone = currentUserData.value?.phone ?? ''
  profileForm.residence = currentUserData.value?.residence ?? ''
  profileForm.password = ''
  profileError.value = ''
  profileSuccess.value = ''
  showProfileModal.value = true
}

async function saveProfile() {
  profileSaving.value = true
  profileError.value = ''
  profileSuccess.value = ''
  try {
    const { updateProfile, updateEmail, updatePassword } = await import('firebase/auth')
    const { doc, updateDoc } = await import('firebase/firestore')

    const fs = $firestore as any
    const uid = auth?.currentUser?.uid

    if (auth?.currentUser) {
      // 1. Update Auth Profile Display Name if changed
      if (profileForm.displayName !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, { displayName: profileForm.displayName })
      }
      
      // 2. Update Auth Email if changed
      if (profileForm.email !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, profileForm.email)
      }

      // 3. Update Auth Password if provided
      if (profileForm.password) {
        await updatePassword(auth.currentUser, profileForm.password)
      }
    }

    // 4. Update Firestore Profile
    if (uid && fs) {
      const parts = profileForm.displayName.trim().split(' ')
      const firstName = parts[0] ?? ''
      const lastName = parts.slice(1).join(' ') ?? ''

      const payload = {
        displayName: profileForm.displayName,
        firstName,
        lastName,
        email: profileForm.email,
        phone: profileForm.phone,
        residence: profileForm.residence
      }
      
      await updateDoc(doc(fs, 'users', uid), payload)
      
      if (!currentUserData.value) {
        currentUserData.value = {}
      }
      Object.assign(currentUserData.value, payload)
    }

    profileSuccess.value = "Profil mis à jour avec succès !"
    setTimeout(() => {
      showProfileModal.value = false
      profileSuccess.value = ''
    }, 1500)
  } catch (e: any) {
    console.error('[AdminLayout] Save profile error:', e)
    const errorCodes: Record<string, string> = {
      'auth/requires-recent-login': "Cette opération nécessite une authentification récente. Veuillez vous reconnecter puis réessaye.",
      'auth/email-already-in-use': "Cette adresse email est déjà utilisée.",
      'auth/weak-password': "Le mot de passe doit contenir au moins 6 caractères.",
      'auth/invalid-email': "L'adresse email est invalide."
    }
    profileError.value = errorCodes[e.code] ?? e.message ?? "Impossible de modifier vos informations."
  } finally {
    profileSaving.value = false
  }
}
</script>
