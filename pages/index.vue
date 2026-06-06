<template>
  <div class="font-sans">
    <LandingAppNav />
    <LandingHeroSection />
    <LandingFeaturesSection />
    <LandingWhySection />
    <LandingDownloadCTA />
    <LandingAppFooter />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Faso Agri - Le réseau social de chaîne de valeur agro-pastorale',
  description: 'Faso Agri connecte producteurs, éleveurs, acheteurs et professionnels de l\'agriculture burkinabè en un seul endroit.',
  ogImage: '/images/logo.png',
})
</script>
