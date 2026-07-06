import { ref, onMounted } from 'vue'

export function useAdminAuth() {
  const { $auth, $firestore } = useNuxtApp()
  const currentUserId = ref('')
  const isSuperAdmin = ref(false)
  const isAuthLoaded = ref(false)

  onMounted(async () => {
    if ($auth && ($auth as any).currentUser) {
      currentUserId.value = ($auth as any).currentUser.uid
      if ($firestore) {
        try {
          const { doc, getDoc } = await import('firebase/firestore')
          const snap = await getDoc(doc($firestore as any, 'users', currentUserId.value))
          if (snap.exists()) {
            const data = snap.data()
            isSuperAdmin.value = (data.role === 'superadmin' || data.roles?.includes('superadmin'))
          }
        } catch (e) {
          console.error('[useAdminAuth]', e)
        }
      }
    } else {
      // Fallback for demo or no-auth mode
      isSuperAdmin.value = true
    }
    isAuthLoaded.value = true
  })

  return {
    currentUserId,
    isSuperAdmin,
    isAuthLoaded
  }
}
