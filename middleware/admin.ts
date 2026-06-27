// middleware/admin.ts
export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/admin/login') return

  const { $auth, $firestore } = useNuxtApp()

  // If Firebase is not configured, allow access (dev/demo mode)
  if (!$auth) return

  const user = ($auth as any).currentUser

  if (!user) {
    return navigateTo('/admin/login')
  }

  try {
    const { getIdTokenResult } = await import('firebase/auth')
    const tokenResult = await getIdTokenResult(user, /* forceRefresh */ false)
    const claimRole   = tokenResult.claims['role'] as string | undefined

    // 1. Check Firebase Custom Claims first (fastest)
    if (claimRole === 'admin' || claimRole === 'superadmin') return

    // 2. Fall back to checking Firestore user document role field
    if ($firestore) {
      const { doc, getDoc } = await import('firebase/firestore')
      const userSnap = await getDoc(doc($firestore as any, 'users', user.uid))
      if (userSnap.exists()) {
        const data = userSnap.data()
        const role = data?.role ?? data?.roles?.[0]
        if (role === 'admin' || role === 'superadmin') return
      }
    }

    // Neither claim nor Firestore role is admin → redirect
    return navigateTo('/admin/login')
  } catch (e) {
    console.error('[admin middleware]', e)
    return navigateTo('/admin/login')
  }
})
