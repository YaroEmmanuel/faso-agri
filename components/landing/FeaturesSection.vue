<template>
  <section id="features" class="py-16 px-6 bg-gray-50">
    <div class="max-w-6xl mx-auto">

      <div class="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
        Ce que vous pouvez faire
      </div>
      <h2 class="text-3xl font-semibold mb-2">Tout ce dont un acteur du secteur agro-pastoral, ou un amateur a besoin</h2>
      <p class="text-gray-500 mb-9">Quatre modules conçus pour le terrain burkinabè</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="bg-white p-5 rounded-xl border border-gray-300"
        >
          <div
            class="w-10 h-10 rounded-lg flex items-center justify-center mb-3.5"
            :class="feature.iconBg"
          >
            <component :is="feature.icon" />
          </div>
          <div class="font-semibold text-md mb-2">{{ feature.title }}</div>
          <div class="text-sm text-gray-500">{{ feature.description }}</div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'

// Inline SVG icon components
const IconMarche = defineComponent({
  render: () => h('svg', { class: 'w-5 h-5', viewBox: '0 0 20 20', fill: 'none', stroke: '#3B6D11', 'stroke-width': '1.5' }, [
    h('rect', { x: '2', y: '4', width: '16', height: '12', rx: '2' }),
    h('path', { d: 'M6 8h8M6 11h5' }),
  ]),
})

const IconAnnuaire = defineComponent({
  render: () => h('svg', { class: 'w-5 h-5', viewBox: '0 0 20 20', fill: 'none', stroke: '#0F6E56', 'stroke-width': '1.5' }, [
    h('circle', { cx: '10', cy: '7', r: '3' }),
    h('path', { d: 'M4 16c0-3.3 2.7-6 6-6s6 2.7 6 6' }),
  ]),
})

const IconEvenements = defineComponent({
  render: () => h('svg', { class: 'w-5 h-5', viewBox: '0 0 20 20', fill: 'none', stroke: '#854F0B', 'stroke-width': '1.5' }, [
    h('rect', { x: '3', y: '4', width: '14', height: '13', rx: '2' }),
    h('path', { d: 'M7 2v4M13 2v4M3 9h14' }),
  ]),
})

const IconInfos = defineComponent({
  render: () => h('svg', { class: 'w-5 h-5', viewBox: '0 0 20 20', fill: 'none', stroke: '#185FA5', 'stroke-width': '1.5' }, [
    h('path', { d: 'M4 5h12M4 9h8M4 13h10' }),
  ]),
})

const features = [
  {
    title: 'Marché agricole',
    description: 'Achetez et vendez vos produits entre producteurs et acheteurs.',
    iconBg: 'bg-green-100',
    icon: IconMarche,
  },
  {
    title: 'Événements',
    description: 'Découvrez foires, formations et rencontres agricoles.',
    iconBg: 'bg-amber-100',
    icon: IconEvenements,
  },
  {
    title: 'Annuaire',
    description: 'Trouvez vétérinaires, fournisseurs et techniciens près de chez vous.',
    iconBg: 'bg-emerald-100',
    icon: IconAnnuaire,
  },
  {
    title: 'Astuces & conseils',
    description: 'Guides techniques, conseils et forum d\'échange.',
    iconBg: 'bg-blue-100',
    icon: IconInfos,
  },
]
</script>
