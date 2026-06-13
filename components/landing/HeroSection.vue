<template>
  <div class="bg-gradient-to-br from-tertiary to-white">
      <header class="pt-24 pb-16 px-6 flex flex-col md:flex-row items-center gap-10 max-w-6xl mx-auto ">

      <!-- Contenu textuel -->
      <div class="flex-1">

        <h1 class="text-primary text-6xl font-semibold leading-tight mb-1">Faso Agri</h1>

        <p class="text-secondary text-2xl font-medium mb-5 leading-snug">
          Vendez, achetez et interagisseez avec les acteurs des secteurs agro-pastoraux.<br>Depuis votre localité.
        </p>

        <p class="text-gray-500 text-md leading-relaxed mb-7">
          Producteurs, éleveurs, acteurs du secteur - trouvez des acheteurs,
          des vétérinaires et les bons prix du marché. Tout ça depuis
          votre téléphone, partout au Burkina Faso.
        </p>

        <button class="bg-primary text-white px-7 py-3 rounded-lg text-base font-medium hover:bg-secondary transition-colors duration-300">
          Télécharger gratuitement
        </button>

        <!-- Stats -->
        <div class="flex gap-8 pt-6 mt-6 border-t border-gray-100">
          <div v-for="stat in stats" :key="stat.label">
            <div class="text-2xl font-semibold text-primary">{{ stat.value }}</div>
            <div class="text-xs text-gray-500 mt-0.5">{{ stat.label }}</div>
          </div>
        </div>

      </div>

      <!-- Carousel screenshots -->
      <div class="flex-1 flex flex-col items-center justify-center gap-4">
        <NuxtImg
          :src="screenshots[currentIndex]"
          :alt="`screenshot ${currentIndex + 1}`"
          class="w-58 md:w-48 lg:w-56 rounded-2xl shadow-lg transition-all duration-300"
        />
        <div class="flex gap-2">
          <button
            v-for="(_, i) in screenshots"
            :key="i"
            :aria-label="`Aller à la capture d'écran ${i + 1}`"
            class="w-2 h-2 rounded-full transition-all duration-300"
            :class="i === currentIndex ? 'bg-primary' : 'bg-gray-300 hover:bg-secondary'"
            @click="currentIndex = i"
          />
        </div>
      </div>

    </header>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const stats = [
  { value: '17', label: 'Régions couvertes' },
  { value: '4', label: 'Modules disponibles' },
  { value: '100%', label: 'Gratuit' },
]

const screenshots = [
  '/faso-agri/images/screenshot1.jpeg',
  '/faso-agri/images/screenshot1.jpeg',
  '/faso-agri/images/screenshot1.jpeg',
]

const currentIndex = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % screenshots.length
  }, 3000)
})

onUnmounted(() => clearInterval(timer))
</script>