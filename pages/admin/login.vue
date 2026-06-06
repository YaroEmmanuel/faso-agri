<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="w-full max-w-sm">

      <!-- Logo -->
      <div class="text-center mb-10">
        <div class="text-3xl font-semibold text-primary uppercase tracking-widest mb-1">Faso Agri</div>
        <p class="text-xs text-gray-400 tracking-wide uppercase">Espace administration</p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 class="text-lg font-semibold text-gray-900 mb-6">Connexion</h1>

        <form @submit.prevent="handleLogin" class="space-y-4">

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
              Adresse e-mail
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="admin@fasoagri.bf"
              class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
              Mot de passe
            </label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition pr-10"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                <svg v-if="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Erreur -->
          <div v-if="error" class="flex items-center gap-2 text-xs text-red-600 bg-red-50 rounded-xl px-4 py-3">
            <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            <span v-if="!loading">Se connecter</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Connexion...
            </span>
          </button>

        </form>
      </div>

      <p class="text-center text-xs text-gray-400 mt-6">Faso Agri · Yaangré Tech</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { $auth } = useNuxtApp()
const router = useRouter()

const form = reactive({ email: '', password: '' })
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true

  // Mode démo : Firebase non configuré → accès direct
  if (!$auth) {
    await router.push('/admin')
    loading.value = false
    return
  }

  try {
    const { signInWithEmailAndPassword } = await import('firebase/auth')
    await signInWithEmailAndPassword($auth as any, form.email, form.password)
    await router.push('/admin')
  } catch (e: any) {
    const codes: Record<string, string> = {
      'auth/invalid-credential': 'Email ou mot de passe incorrect.',
      'auth/user-disabled': 'Ce compte a été désactivé.',
      'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard.',
    }
    error.value = codes[e.code] ?? 'Une erreur est survenue.'
  } finally {
    loading.value = false
  }
}

useSeoMeta({ title: 'Connexion — Admin Faso Agri' })
</script>

