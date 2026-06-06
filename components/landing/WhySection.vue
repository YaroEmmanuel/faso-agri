<template>
  <section id="about" class="py-16 px-6">
    <div class="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-start">

      <!-- Texte -->
      <div class="flex-1">
        <div class="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
          Pourquoi Faso Agri
        </div>
        <h2 class="text-3xl font-semibold mb-2 leading-tight">
          Conçu pour<br>le terrain burkinabè
        </h2>
        <p class="text-gray-500 text-sm mb-8">
          Une solution numérique pensée pour faciliter les échanges agro-pastoraux au Burkina Faso.
        </p>

        <div class="space-y-3">
          <div
            v-for="point in points"
            :key="point"
            class="flex items-start gap-3 bg-gray-50 border border-gray-300 rounded-xl p-4"
          >
            <div class="w-7 h-7 rounded-full bg-tertiary flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg class="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="#3B6D11" stroke-width="1.5">
                <path d="M2 7l3 3 7-6"/>
              </svg>
            </div>
            <span class="text-sm leading-relaxed">{{ point }}</span>
          </div>
        </div>
      </div>

      <!-- Séparateur vertical (desktop) -->
      <div class="hidden lg:block w-px bg-gray-200 self-stretch"></div>

      <!-- Stats grid -->
      <div class="flex-1 grid grid-cols-2 gap-3">
        <div
          v-for="(stat, index) in stats"
          :key="stat.label"
          class="p-5 rounded-xl border"
          :class="index % 3 === 0 ? 'bg-primary border-primary text-white' : 'bg-white border-gray-300'"
        >
          <div
            class="text-4xl font-semibold mb-1.5"
            :class="index % 3 === 0 ? 'text-white' : 'text-primary'"
          >
            {{ stat.value }}
          </div>
          <div
            class="text-xs leading-snug"
            :class="index % 3 === 0 ? 'text-white/75' : 'text-gray-500'"
          >
            {{ stat.label }}
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
const points = [
  'Interface simple, et fluidifiée pour les utilisateurs de tous âges',
  'Données locales : prix du marché, professionnels proches',
  '100% gratuit',
  '100% burkinabè, pour les acteurs locaux',
]

const stats = [
  { value: '17', label: 'Régions du Burkina Faso' },
  { value: '4', label: 'Modules disponibles' },
  { value: '100%', label: 'Gratuit et accessible' },
  { value: '1', label: 'App, tout en un' },
]
</script>
