<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="$emit('close')">
      <div class="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 relative">
        <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4 mx-auto">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 text-center mb-2">{{ title }}</h3>
        <p class="text-sm text-gray-500 text-center mb-6">{{ message }}</p>
        <div class="flex gap-3">
          <button @click="$emit('close')" class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium text-sm">Annuler</button>
          <button @click="$emit('confirm')" class="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium text-sm flex items-center justify-center gap-2" :disabled="loading">
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps({
  isOpen: Boolean,
  loading: Boolean,
  title: { type: String, default: "Supprimer cet élément ?" },
  message: { type: String, default: "Cette action est définitive et ne peut pas être annulée. Êtes-vous sûr de vouloir continuer ?" }
})
defineEmits(['close', 'confirm'])
</script>
