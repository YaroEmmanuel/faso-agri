<template>
  <AdminLayout>
    <div class="space-y-5">

      <!-- En-tête -->
      <div>
        <h1 class="text-xl font-semibold text-gray-900">Forum</h1>
        <p class="text-sm text-gray-400 mt-0.5">Modération des discussions</p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'"
          class="relative px-5 py-1.5 rounded-lg text-sm font-medium transition"
        >
          {{ tab.label }}
          <span
            v-if="tab.badge > 0"
            class="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center"
          >
            {{ tab.badge }}
          </span>
        </button>
      </div>

      <!-- Sujets -->
      <div v-if="activeTab === 'topics'" class="space-y-3">
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 6" :key="i" class="h-16 bg-gray-100 rounded-xl animate-pulse" />
        </div>

        <div
          v-for="topic in topics"
          :key="topic.id"
          :class="topic.reported ? 'border-red-100 bg-red-50/30' : 'border-gray-100 bg-white'"
          class="rounded-2xl border p-4 hover:shadow-sm transition"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <span v-if="topic.status === 'pinned'" class="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">📌 Épinglé</span>
                <span v-if="topic.status === 'closed'" class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">🔒 Fermé</span>
                <span v-if="topic.reported" class="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">⚠️ Signalé</span>
              </div>
              <NuxtLink :to="`/admin/forum/${topic.id}`" class="font-medium text-gray-900 hover:text-primary transition line-clamp-1">
                {{ topic.title }}
              </NuxtLink>
              <p class="text-xs text-gray-400 mt-0.5">
                {{ topic.replyCount }} réponse{{ topic.replyCount !== 1 ? 's' : '' }} · {{ formatDate(topic.createdAt) }}
              </p>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
              <!-- Épingler/désépingler -->
              <button
                @click="togglePin(topic)"
                :title="topic.status === 'pinned' ? 'Désépingler' : 'Épingler'"
                class="p-2 rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-gray-700"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                </svg>
              </button>
              <!-- Fermer -->
              <button
                @click="closeTopic(topic)"
                :title="topic.status === 'closed' ? 'Rouvrir' : 'Fermer'"
                class="p-2 rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-gray-700"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </button>
              <!-- Supprimer -->
              <button
                @click="deleteTopic(topic.id)"
                title="Supprimer"
                class="p-2 rounded-lg hover:bg-red-50 transition text-gray-400 hover:text-red-500"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <p v-if="!loading && topics.length === 0" class="text-center text-sm text-gray-400 py-10">
          Aucun sujet de forum.
        </p>
      </div>

      <!-- Signalements -->
      <div v-if="activeTab === 'reported'" class="space-y-3">
        <div
          v-for="item in reportedItems"
          :key="item.id"
          class="bg-white rounded-2xl border border-red-100 p-4"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <p class="text-xs text-red-500 font-medium mb-1 uppercase tracking-wide">
                {{ item.type === 'topic' ? 'Sujet' : 'Réponse' }}
              </p>
              <p class="text-sm text-gray-800 line-clamp-2">{{ item.content }}</p>
            </div>
            <button
              @click="deleteReported(item)"
              class="text-xs text-red-500 hover:text-red-700 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition flex-shrink-0"
            >
              Supprimer
            </button>
          </div>
        </div>
        <p v-if="reportedItems.length === 0" class="text-center text-sm text-gray-400 py-10">
          Aucun contenu signalé. ✓
        </p>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import {
  collection, query, orderBy, getDocs,
  doc, updateDoc, deleteDoc, where
} from 'firebase/firestore'

const { $firestore } = useNuxtApp()

definePageMeta({ middleware: 'admin' })
useSeoMeta({ title: 'Forum — Admin Faso Agri' })

const loading = ref(true)
const topics = ref<any[]>([])
const reportedItems = ref<any[]>([])

const reportedCount = computed(() => reportedItems.value.length)

const tabs = computed(() => [
  { key: 'topics', label: 'Sujets', badge: 0 },
  { key: 'reported', label: 'Signalements', badge: reportedCount.value },
])
const activeTab = ref('topics')

function formatDate(ts: any) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function togglePin(topic: any) {
  const newStatus = topic.status === 'pinned' ? 'open' : 'pinned'
  await updateDoc(doc($firestore, 'forumTopics', topic.id), { status: newStatus })
  topic.status = newStatus
}

async function closeTopic(topic: any) {
  const newStatus = topic.status === 'closed' ? 'open' : 'closed'
  await updateDoc(doc($firestore, 'forumTopics', topic.id), { status: newStatus })
  topic.status = newStatus
}

async function deleteTopic(id: string) {
  if (!confirm('Supprimer ce sujet définitivement ?')) return
  await deleteDoc(doc($firestore, 'forumTopics', id))
  topics.value = topics.value.filter(t => t.id !== id)
}

async function deleteReported(item: any) {
  if (!confirm('Supprimer ce contenu ?')) return
  const col = item.type === 'topic' ? 'forumTopics' : 'forumReplies'
  await deleteDoc(doc($firestore, col, item.id))
  reportedItems.value = reportedItems.value.filter(i => i.id !== item.id)
}

onMounted(async () => {
  loading.value = true
  try {
    const topicsSnap = await getDocs(
      query(collection($firestore, 'forumTopics'), orderBy('createdAt', 'desc'))
    )
    topics.value = topicsSnap.docs.map(d => ({ id: d.id, ...d.data() }))

    // Sujets signalés
    const repTopicsSnap = await getDocs(
      query(collection($firestore, 'forumTopics'), where('reported', '==', true))
    )
    const repRepliesSnap = await getDocs(
      query(collection($firestore, 'forumReplies'), where('reported', '==', true))
    )
    reportedItems.value = [
      ...repTopicsSnap.docs.map(d => ({ id: d.id, type: 'topic',  ...d.data() })),
      ...repRepliesSnap.docs.map(d => ({ id: d.id, type: 'reply', ...d.data() })),
    ]
  } finally {
    loading.value = false
  }
})
</script>
