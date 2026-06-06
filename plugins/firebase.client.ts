import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const apiKey = config.public.firebaseApiKey as string

  if (!apiKey || apiKey === 'your-api-key' || apiKey === '') {
    return {
      provide: {
        auth:      null,
        firestore: null,
      },
    }
  }

  try {
    const firebaseConfig = {
      apiKey,
      authDomain:        config.public.firebaseAuthDomain,
      projectId:         config.public.firebaseProjectId,
      storageBucket:     config.public.firebaseStorageBucket,
      messagingSenderId: config.public.firebaseMessagingSenderId,
      appId:             config.public.firebaseAppId,
    }

    const app       = getApps().length ? getApp() : initializeApp(firebaseConfig)
    const auth      = getAuth(app)
    const firestore = getFirestore(app)

    return { provide: { auth, firestore } }
  } catch (e) {
    console.error('[Firebase] Erreur d\'initialisation :', e)
    return { provide: { auth: null, firestore: null } }
  }
})
