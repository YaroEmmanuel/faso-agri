<template>
  <footer class="bg-primary py-5 px-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
    <div class="text-xs text-white">© 2026 Faso Agri. Tous droits réservés.</div>
    <div class="flex gap-5 text-xs text-white">
      <a href="mailto:contact@ytech-bf.com" class="hover:text-white/70 transition-colors">Contacts</a>
      <NuxtLink to="/confidentialite" class="hover:text-white/70 transition-colors">
        Confidentialités
      </NuxtLink>
      <NuxtLink to="/admin" class="hover:text-white/70 transition-colors">
        Admin
      </NuxtLink>
    </div>
  </footer>
</template>
