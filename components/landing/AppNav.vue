<template>
  <nav class="fixed top-0 w-full bg-white border-b border-gray-200 z-50 py-1">
    <div class="flex items-center px-1 max-w-6xl mx-auto justify-between">

      <!-- Logo -->
      <div>
        <NuxtLink to="/" class="flex items-center gap-2">
          <!-- <img src="/faso-agri/images/logo.png" alt="logo faso agri" class="h-12 w-12" /> -->
          <NuxtImg src="/faso-agri/images/logo.png" alt="logo faso agri" class="h-12 w-12" />
          <span class="text-lg font-bold text-black hidden md:block">
            Faso Agri
          </span>
        </NuxtLink>
      </div>

      <div class="flex gap-6 items-center">
        <!-- Desktop links -->
        <div class="text-black text-md md:flex gap-4 hidden">
          <a href="#features" class="hover:text-primary">Fonctionnalités</a>
          <a href="#about" class="hover:text-primary">Pourquoi Faso Agri</a>
          <a href="#contact" class="hover:text-primary">Contact</a>
        </div>

        <button class="bg-primary text-white px-5 py-2 rounded-md text-sm hover:bg-secondary transition-colors duration-300">
          Télécharger
        </button>
      </div>

    </div>
  </nav>
</template>
