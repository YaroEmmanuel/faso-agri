<template>
  <AdminLayout>
    <div class="space-y-5">

      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-gray-900">Forum</h1>
          <p class="text-sm text-gray-400 mt-0.5">Gestion des discussions de la communauté</p>
        </div>
        <button
          @click="exportCsv"
          class="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 rounded-xl transition"
        >
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Exporter en CSV
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          v-for="tab in tabs" :key="tab.key"
          @click="activeTab = tab.key"
          :class="activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'"
          class="relative px-5 py-1.5 rounded-lg text-sm font-medium transition"
        >
          {{ tab.label }}
          <span
            v-if="tab.badge > 0"
            class="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center"
          >{{ tab.badge }}</span>
        </button>
      </div>

      <!-- Sujets / Discussions -->
      <div v-if="activeTab === 'topics'" class="space-y-3">
        <!-- Search bar for topics -->
        <input v-model="searchTopics" type="text" placeholder="Rechercher dans les discussions..."
          class="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" />

        <div v-if="loading" class="space-y-3">
          <div v-for="i in 6" :key="i" class="h-16 bg-gray-100 rounded-xl animate-pulse" />
        </div>

        <div
          v-for="topic in paginatedTopics" :key="topic.id"
          :class="topic.reported ? 'border-red-100 bg-red-50/30 shadow-[0_8px_30px_rgb(239,68,68,0.015)]' : 'border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.012)]'"
          class="rounded-2xl border p-5 hover:border-primary/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.035)] hover:-translate-y-0.5 transition-all duration-300"
        >
          <div class="flex items-start justify-between gap-4">
            <!-- Infos cliquables -->
            <button class="flex-1 min-w-0 text-left group" @click="openDrawer(topic)">
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <span v-if="topic.status === 'closed'" class="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  Fermé
                </span>
                <span v-if="topic.reported" class="inline-flex items-center gap-1 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
                  Signalé
                </span>
                <span v-if="topic.category" class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{{ topic.category }}</span>
              </div>
              <p class="font-medium text-gray-900 group-hover:text-primary transition line-clamp-1">{{ topic.title || topic.content || '(Sans titre)' }}</p>
              <p class="text-xs text-gray-400 mt-0.5 flex items-center gap-2 flex-wrap">
                <span class="font-medium text-gray-500">{{ topic.authorName || 'Anonyme' }}</span>
                <span>· {{ topic.replies ?? topic.replyCount ?? 0 }} réponse{{ (topic.replies ?? topic.replyCount ?? 0) !== 1 ? 's' : '' }}</span>
                <span class="inline-flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  {{ formatDate(topic.createdAt) }}
                </span>
              </p>
            </button>
            <!-- Actions -->
            <div class="flex items-center gap-1 flex-shrink-0">
              <!-- Voir détails -->
              <button @click="openDrawer(topic)" title="Voir les détails"
                class="p-2 rounded-lg hover:bg-primary/10 transition text-gray-400 hover:text-primary">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
              <!-- Fermer/Rouvrir -->
              <button @click="closeTopic(topic)" :title="topic.status === 'closed' ? 'Rouvrir' : 'Fermer'"
                class="p-2 rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-gray-700">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </button>
              <!-- Supprimer -->
              <button
                v-if="isSuperAdmin"
                @click="askDeleteTopic(topic.id)" title="Supprimer"
                class="p-2 rounded-lg hover:bg-red-50 transition text-gray-400 hover:text-red-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
              <button
                v-else
                disabled
                class="p-2 rounded-lg text-gray-300 cursor-not-allowed transition" title="Seul un super admin peut supprimer">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <p v-if="!loading && filteredTopics.length === 0" class="text-center text-sm text-gray-400 py-10">Aucun sujet de forum.</p>

        <!-- Pagination -->
        <div v-if="topicsTotalPages > 1" class="flex items-center justify-between text-sm text-gray-400">
          <span>Page {{ topicsPage }} / {{ topicsTotalPages }} · <strong class="text-gray-600">{{ filteredTopics.length }}</strong> sujet{{ filteredTopics.length !== 1 ? 's' : '' }}</span>
          <div class="flex items-center gap-1.5">
            <button @click="topicsPage = 1" :disabled="topicsPage === 1"
              class="p-2 rounded-xl border border-gray-200 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition text-gray-500" title="Première page">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/></svg>
            </button>
            <button @click="topicsPage--" :disabled="topicsPage === 1"
              class="px-3.5 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition text-gray-600">Préc.</button>
            <div class="flex gap-1">
              <button v-for="p in topicsVisiblePages" :key="p"
                @click="typeof p === 'number' && (topicsPage = p)"
                :class="p === topicsPage ? 'bg-primary text-white border-primary' : p === '...' ? 'border-transparent text-gray-400 cursor-default' : 'border-gray-200 text-gray-600 hover:border-gray-300'"
                class="w-8 h-8 rounded-xl border text-xs font-medium transition">{{ p }}</button>
            </div>
            <button @click="topicsPage++" :disabled="topicsPage === topicsTotalPages"
              class="px-3.5 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition text-gray-600">Suiv.</button>
            <button @click="topicsPage = topicsTotalPages" :disabled="topicsPage === topicsTotalPages"
              class="p-2 rounded-xl border border-gray-200 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition text-gray-500" title="Dernière page">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Signalements -->
      <div v-if="activeTab === 'reported'" class="space-y-3">
        <div v-for="item in reportedItems" :key="item.id" class="bg-white rounded-2xl border border-red-100 p-4">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <p class="text-xs text-red-500 font-medium mb-1 uppercase tracking-wide">{{ item.type === 'topic' ? 'Sujet' : 'Réponse' }}</p>
              <p class="text-sm text-gray-800 line-clamp-2">{{ item.content ?? item.title ?? '(Contenu vide)' }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ item.authorName ?? 'Anonyme' }} · {{ formatDate(item.createdAt) }}</p>
            </div>
            <button
              v-if="isSuperAdmin"
              @click="askDeleteReported(item)"
              class="text-xs text-red-500 hover:text-red-700 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition flex-shrink-0">
              Supprimer
            </button>
            <button
              v-else
              disabled
              class="text-xs text-gray-300 border border-gray-200 rounded-lg px-3 py-1.5 cursor-not-allowed transition flex-shrink-0" title="Seul un super admin peut supprimer">
              Supprimer
            </button>
          </div>
        </div>
        <p v-if="reportedItems.length === 0" class="text-center text-sm text-gray-400 py-10">Aucun contenu signalé.</p>
      </div>

      <!-- Error -->
      <div v-if="loadError" class="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-700">
        ⚠️ {{ loadError }}
      </div>

    </div>

    <!-- ── Drawer de détail / fil de discussion ──────────────────────────── -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="drawer.open" class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" @click="drawer.open = false" />
      </Transition>

      <Transition name="slide">
        <div v-if="drawer.open" class="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col">

          <!-- En-tête -->
          <div class="flex items-start justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
            <div class="flex-1 min-w-0 pr-4">
              <div class="flex flex-wrap gap-1.5 mb-2">
                <span v-if="drawer.topic?.category" class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{{ drawer.topic.category }}</span>
                <span v-if="drawer.topic?.status === 'closed'" class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Fermé</span>
                <span v-if="drawer.topic?.reported" class="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">Signalé</span>
              </div>
              <h2 class="text-base font-bold text-gray-900 leading-snug">{{ drawer.topic?.title || drawer.topic?.content || '(Sans titre)' }}</h2>
              <p class="text-xs text-gray-400 mt-1">
                {{ drawer.topic?.authorName ?? 'Anonyme' }}
                · {{ formatDate(drawer.topic?.createdAt) }}
              </p>
            </div>
            <button @click="drawer.open = false" class="text-gray-400 hover:text-gray-600 transition p-1 flex-shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Contenu scrollable -->
          <div class="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            <!-- Chargement -->
            <div v-if="drawer.loading" class="space-y-3">
              <div v-for="i in 4" :key="i" class="h-3 bg-gray-100 rounded animate-pulse" />
            </div>

            <template v-else>
              <!-- Corps du message original -->
              <div v-if="drawer.topic?.content || drawer.topic?.title">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Message original</p>
                <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold flex-shrink-0">
                      {{ initials(drawer.topic?.authorName ?? 'A') }}
                    </div>
                    <div>
                      <p class="text-xs font-semibold text-gray-800">{{ drawer.topic?.authorName ?? 'Anonyme' }}</p>
                      <p class="text-[10px] text-gray-400">{{ formatDate(drawer.topic?.createdAt) }}</p>
                    </div>
                  </div>
                  <p class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{{ drawer.topic?.content ?? drawer.topic?.title ?? '—' }}</p>
                </div>
              </div>

              <!-- Fil de réponses -->
              <div>
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Fil de discussion
                  <span class="text-gray-500 ml-1">({{ drawer.replies.length }} réponse{{ drawer.replies.length !== 1 ? 's' : '' }})</span>
                </p>

                <div v-if="drawer.replies.length === 0" class="text-center py-6 text-sm text-gray-400 bg-gray-50 rounded-xl border border-gray-100">
                  Aucune réponse pour l'instant.
                </div>

                <div v-else class="space-y-3">
                  <div v-for="reply in drawer.replies" :key="reply.id" class="flex gap-3">
                    <div class="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center text-primary text-[10px] font-bold flex-shrink-0 mt-0.5">
                      {{ initials(reply.authorName ?? 'A') }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3 border border-gray-100">
                        <div class="flex items-baseline justify-between gap-2 mb-1.5">
                          <p class="text-xs font-semibold text-gray-800">{{ reply.authorName ?? 'Anonyme' }}</p>
                          <p class="text-[10px] text-gray-400 flex-shrink-0">{{ formatDate(reply.createdAt) }}</p>
                        </div>
                        <p class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{{ reply.content ?? '—' }}</p>
                      </div>
                      <!-- Supprimer réponse -->
                      <button
                        v-if="isSuperAdmin"
                        @click="askDeleteReply(drawer.topic?.id, reply.id)"
                        class="mt-1 ml-1 text-[11px] text-gray-400 hover:text-red-500 transition"
                      >
                        Supprimer
                      </button>
                      <span
                        v-else
                        class="mt-1 ml-1 text-[11px] text-gray-300 cursor-not-allowed transition inline-block" title="Seul un super admin peut supprimer"
                      >
                        Supprimer
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- Pied du drawer -->
          <div class="flex items-center gap-2 px-6 py-4 border-t border-gray-100 flex-shrink-0">
            <button
              @click="toggleClose"
              class="px-3 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
            >
              {{ drawer.topic?.status === 'closed' ? 'Rouvrir' : 'Fermer' }}
            </button>
            <!-- Modifier -->
            <button
              @click="openTopicEditor(drawer.topic)"
              class="px-3 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
            >
              <span class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                Modifier
              </span>
            </button>
            <div class="flex-1" />
            <button
              v-if="isSuperAdmin"
              @click="askDeleteTopic(drawer.topic?.id, true)"
              class="px-3 py-2 text-sm border border-red-200 rounded-xl text-red-500 hover:bg-red-50 transition"
            >
              Supprimer le sujet
            </button>
            <button
              v-else
              disabled
              class="px-3 py-2 text-sm border border-gray-200 rounded-xl text-gray-300 cursor-not-allowed transition" title="Seul un super admin peut supprimer"
            >
              Supprimer le sujet
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <AdminConfirmModal
      :isOpen="deleteModalOpen"
      :loading="deleting"
      :title="deleteModalTitle"
      @close="deleteModalOpen = false"
      @confirm="confirmDeleteAction"
    />

    <!-- Modal édition topic (depuis le drawer) -->
    <Teleport to="body">
      <div v-if="topicEditorOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4" @click.self="topicEditorOpen = false">
        <div class="bg-white rounded-2xl w-full max-w-xl shadow-2xl max-h-[90vh] flex flex-col">

          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <h2 class="font-semibold text-gray-900 text-sm">Modifier la discussion</h2>
            <button @click="topicEditorOpen = false" class="text-gray-400 hover:text-gray-600 transition">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div class="overflow-y-auto flex-1 px-6 py-5 space-y-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Titre</label>
              <input v-model="editorForm.title" type="text" class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Contenu</label>
              <textarea v-model="editorForm.content" rows="6" class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Catégorie</label>
              <input v-model="editorForm.category" type="text" class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Statut</label>
              <select v-model="editorForm.status" class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition">
                <option value="open">Ouvert</option>
                <option value="closed">Fermé</option>
                <option value="pinned">Épinglé</option>
              </select>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
            <button @click="topicEditorOpen = false" type="button" class="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition">Annuler</button>
            <button @click="saveTopicEdit" :disabled="topicSaving" class="flex-1 px-4 py-2 text-sm bg-primary text-white rounded-xl hover:opacity-90 transition disabled:opacity-50">
              {{ topicSaving ? 'Enregistrement…' : 'Enregistrer' }}
            </button>
          </div>

        </div>
      </div>
    </Teleport>

  </AdminLayout>
</template>

<script setup lang="ts">
const { $firestore } = useNuxtApp()
definePageMeta({ middleware: 'admin' })
useSeoMeta({ title: 'Forum — Admin Faso Agri' })

const { isSuperAdmin } = useAdminAuth()

const loading       = ref(false)
const loadError     = ref('')
const topics        = ref<any[]>([])
const reportedItems = ref<any[]>([])

const reportedCount = computed(() => reportedItems.value.length)
const tabs = computed(() => [
  { key: 'topics',   label: 'Discussions',  badge: 0 },
  { key: 'reported', label: 'Signalements', badge: reportedCount.value },
])
const activeTab = ref('topics')

const searchTopics = ref('')
const PAGE_SIZE = 15
const topicsPage = ref(1)

const filteredTopics = computed(() => {
  const term = searchTopics.value.toLowerCase()
  if (!term) return topics.value
  return topics.value.filter(t =>
    (t.title ?? '').toLowerCase().includes(term) ||
    (t.content ?? '').toLowerCase().includes(term) ||
    (t.authorName ?? '').toLowerCase().includes(term)
  )
})
const topicsTotalPages = computed(() => Math.max(1, Math.ceil(filteredTopics.value.length / PAGE_SIZE)))
const paginatedTopics = computed(() => {
  const start = (topicsPage.value - 1) * PAGE_SIZE
  return filteredTopics.value.slice(start, start + PAGE_SIZE)
})
const topicsVisiblePages = computed(() => {
  const total = topicsTotalPages.value
  const cur = topicsPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | string)[] = [1]
  if (cur > 3) pages.push('...')
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i)
  if (cur < total - 2) pages.push('...')
  pages.push(total)
  return pages
})
watch(filteredTopics, () => { topicsPage.value = 1 })

const deleteModalOpen = ref(false)
const deleting = ref(false)
const deleteModalTitle = ref("Supprimer cet élément ?")
const deletePayload = ref<any>(null)

// ── Topic Editor (depuis le drawer) ─────────────────────────────────────────
const topicEditorOpen = ref(false)
const topicSaving = ref(false)
const editingTopic = ref<any>(null)
const editorForm = reactive({ title: '', content: '', category: '', status: 'open' })

function openTopicEditor(topic: any) {
  if (!topic) return
  editingTopic.value = topic
  editorForm.title    = topic.title ?? ''
  editorForm.content  = topic.content ?? ''
  editorForm.category = topic.category ?? ''
  editorForm.status   = topic.status ?? 'open'
  topicEditorOpen.value = true
}

async function saveTopicEdit() {
  if (!editingTopic.value) return
  topicSaving.value = true
  try {
    const payload = {
      title: editorForm.title,
      content: editorForm.content,
      category: editorForm.category,
      status: editorForm.status
    }
    if ($firestore) {
      const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore')
      await updateDoc(doc($firestore as any, 'discussions', editingTopic.value.id), { ...payload, updatedAt: serverTimestamp() })
    }
    // Mettre à jour l'objet local
    Object.assign(editingTopic.value, payload)
    // Si c'est le topic du drawer ouvert, mettre à jour aussi
    if (drawer.topic?.id === editingTopic.value.id) {
      Object.assign(drawer.topic, payload)
    }
    topicEditorOpen.value = false
  } catch (e: any) {
    alert('Erreur : ' + (e.message ?? 'inconnue'))
  } finally {
    topicSaving.value = false
  }
}

// ── Drawer ──────────────────────────────────────────────────────────────────
const drawer = reactive({
  open: false,
  loading: false,
  topic: null as any,
  replies: [] as any[],
})

function initials(name: string) {
  return name ? name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() : '?'
}

function formatDate(ts: any) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function openDrawer(topic: any) {
  drawer.topic   = topic
  drawer.replies = []
  drawer.open    = true
  drawer.loading = true
  try {
    if ($firestore) {
      const { collection, query, orderBy, getDocs } = await import('firebase/firestore')
      const fs = $firestore as any
      try {
        const repSnap = await getDocs(
          query(collection(fs, 'discussions', topic.id, 'replies'), orderBy('createdAt', 'asc'))
        )
        drawer.replies = repSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }))
      } catch {
        // Sous-collection vide ou absente — normal
        drawer.replies = []
      }
    }
  } catch (e) {
    console.error('[Forum Drawer]', e)
  } finally {
    drawer.loading = false
  }
}

async function toggleClose() {
  if (!drawer.topic) return
  const newStatus = drawer.topic.status === 'closed' ? 'open' : 'closed'
  if ($firestore) {
    const { doc, updateDoc } = await import('firebase/firestore')
    await updateDoc(doc($firestore as any, 'discussions', drawer.topic.id), { status: newStatus })
  }
  drawer.topic.status = newStatus
  // Mettre à jour dans la liste aussi
  const idx = topics.value.findIndex(t => t.id === drawer.topic.id)
  if (idx !== -1) topics.value[idx].status = newStatus
}

async function deleteReply(topicId: string, replyId: string) {
  if ($firestore) {
    const { doc, deleteDoc } = await import('firebase/firestore')
    await deleteDoc(doc($firestore as any, 'discussions', topicId, 'replies', replyId))
  }
  drawer.replies = drawer.replies.filter(r => r.id !== replyId)
  // Décrémenter le compteur dans le topic
  const t = topics.value.find(t => t.id === topicId)
  if (t && (t.replies ?? 0) > 0) t.replies = (t.replies ?? 1) - 1
}

function exportCsv() {
  const headers = ['Titre / Message', 'Auteur', 'Catégorie', 'Réponses', 'Statut', 'Signalement', 'Date']
  const rows = topics.value.map(t => [
    t.title ?? t.content ?? '',
    t.authorName ?? 'Anonyme',
    t.category ?? '',
    t.replies ?? t.replyCount ?? 0,
    t.status ?? 'open',
    t.reported ? 'Oui' : 'Non',
    formatDate(t.createdAt)
  ])
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a'); a.href = url; a.download = 'forum-discussions.csv'; a.click()
  URL.revokeObjectURL(url)
}

async function closeTopic(topic: any) {
  const newStatus = topic.status === 'closed' ? 'open' : 'closed'
  if ($firestore) {
    const { doc, updateDoc } = await import('firebase/firestore')
    await updateDoc(doc($firestore as any, 'discussions', topic.id), { status: newStatus })
  }
  topic.status = newStatus
}

async function deleteTopic(id: string) {
  if (!id) return
  if ($firestore) {
    const { doc, deleteDoc } = await import('firebase/firestore')
    await deleteDoc(doc($firestore as any, 'discussions', id))
  }
  topics.value = topics.value.filter(t => t.id !== id)
}

async function deleteReportedItem(item: any) {
  if ($firestore) {
    const { doc, deleteDoc } = await import('firebase/firestore')
    const col = item.type === 'topic' ? 'discussions' : 'replies'
    await deleteDoc(doc($firestore as any, col, item.id))
  }
  reportedItems.value = reportedItems.value.filter(i => i.id !== item.id)
}

function askDeleteTopic(id: string, closeDrawer = false) {
  if (!isSuperAdmin.value) return
  deletePayload.value = { type: 'topic', id, closeDrawer }
  deleteModalTitle.value = "Supprimer ce sujet définitivement ?"
  deleteModalOpen.value = true
}

function askDeleteReply(topicId: string, replyId: string) {
  if (!isSuperAdmin.value) return
  deletePayload.value = { type: 'reply', topicId, replyId }
  deleteModalTitle.value = "Supprimer cette réponse ?"
  deleteModalOpen.value = true
}

function askDeleteReported(item: any) {
  if (!isSuperAdmin.value) return
  deletePayload.value = { type: 'reported', item }
  deleteModalTitle.value = "Supprimer ce contenu signalé ?"
  deleteModalOpen.value = true
}

async function confirmDeleteAction() {
  if (!deletePayload.value) return
  deleting.value = true
  try {
    const p = deletePayload.value
    if (p.type === 'topic') {
      await deleteTopic(p.id)
      if (p.closeDrawer) drawer.open = false
    } else if (p.type === 'reply') {
      await deleteReply(p.topicId, p.replyId)
    } else if (p.type === 'reported') {
      await deleteReportedItem(p.item)
    }
    deleteModalOpen.value = false
  } catch (e: any) {
    console.error('[Delete]', e)
    alert("Erreur lors de la suppression.")
  } finally {
    deleting.value = false
    deletePayload.value = null
  }
}

onMounted(async () => {
  if (!$firestore) {
    loadError.value = 'Firebase non configuré.'
    return
  }
  loadError.value = ''
  loading.value = true
  try {
    const { collection, query, orderBy, getDocs, where } = await import('firebase/firestore')
    const fs = $firestore as any

    try {
      const topicsSnap = await getDocs(query(collection(fs, 'discussions'), orderBy('createdAt', 'desc')))
      topics.value = topicsSnap.docs.map(d => ({ id: d.id, ...d.data() }))
    } catch {
      // Fallback sans tri si index absent
      const topicsSnap = await getDocs(collection(fs, 'discussions'))
      topics.value = topicsSnap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a: any, b: any) => (b.createdAt?.toDate?.()?.getTime() ?? 0) - (a.createdAt?.toDate?.()?.getTime() ?? 0))
    }

    // Discussions signalées
    try {
      const repSnap = await getDocs(query(collection(fs, 'discussions'), where('reported', '==', true)))
      reportedItems.value = repSnap.docs.map(d => ({ id: d.id, type: 'topic', ...d.data() }))
    } catch { /* champ 'reported' absent */ }

  } catch (e: any) {
    console.error('[Forum]', e)
    loadError.value = e?.message ?? 'Erreur lors du chargement du forum.'
  } finally {
    loading.value = false
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      drawer.open = false
    }
  }
  window.addEventListener('keydown', handleKeyDown)
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
