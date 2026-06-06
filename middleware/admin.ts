// middleware/admin.ts
export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/admin/login') return

  const { $auth } = useNuxtApp()

  if (!$auth) return

  const user = ($auth as any).currentUser

  if (!user) {
    return navigateTo('/admin/login')
  }

  try {
    const { getIdTokenResult } = await import('firebase/auth')
    const tokenResult = await getIdTokenResult(user)
    const role = tokenResult.claims['role']
    if (role !== 'admin' && role !== 'superadmin') {
      return navigateTo('/admin/login')
    }
  } catch {
    return navigateTo('/admin/login')
  }
})
