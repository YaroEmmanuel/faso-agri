<template>
  <section id="download" class="py-16 px-6 bg-secondary text-center">
    <div class="max-w-2xl mx-auto">
      <h2 class="text-3xl font-semibold text-white mb-2">Prêt à rejoindre Faso Agri ?</h2>
      <p class="text-white/80 mb-7">Téléchargez l'application et connectez-vous à la de chaîne de valeur agro-pastorale</p>

      <div class="flex gap-4 justify-center flex-wrap">

        <!-- Google Play -->
        <a href="#" class="bg-white px-5 py-3 rounded-xl flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="black">
            <path d="M3 20.5v-17l18 8.5-18 8.5z"/>
          </svg>
          <div class="text-left">
            <div class="text-[10px] text-gray-500">Disponible sur</div>
            <div class="text-sm font-semibold">Google Play</div>
          </div>
        </a>

        <!-- APK direct -->
        <a href="/downloads/faso-agri-beta.apk" download="faso-agri-beta.apk" class="bg-white px-5 py-3 rounded-xl flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <div class="text-left">
            <div class="text-[10px] text-gray-500">Télécharger l'</div>
            <div class="text-sm font-semibold">APK direct</div>
          </div>
        </a>

      </div>
    </div>
  </section>
</template>
