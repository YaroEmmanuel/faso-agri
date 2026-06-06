import { _ as _sfc_main$5, a as __nuxt_component_0, b as __nuxt_component_1 } from "./AppFooter-D-SWLKRv.js";
import { defineComponent, ref, mergeProps, useSSRContext, h, createVNode, resolveDynamicComponent } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrRenderVNode } from "vue/server-renderer";
import "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/hookable/dist/index.mjs";
import { _ as _export_sfc } from "../server.mjs";
import { a as useSeoMeta } from "./v3-BR0C_1wp.js";
import "./nuxt-link-CkXNCsDJ.js";
import "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/ufo/dist/index.mjs";
import "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/defu/dist/defu.mjs";
import "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/h3/dist/index.mjs";
import "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/unctx/dist/index.mjs";
import "vue-router";
import "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/@unhead/vue/dist/index.mjs";
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "HeroSection",
  __ssrInlineRender: true,
  setup(__props) {
    const stats = [
      { value: "17", label: "Régions couvertes" },
      { value: "4", label: "Modules disponibles" },
      { value: "100%", label: "Gratuit" }
    ];
    const screenshots = [
      "/images/screenshot1.jpeg",
      "/images/screenshot1.jpeg",
      "/images/screenshot1.jpeg"
    ];
    const currentIndex = ref(0);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = _sfc_main$5;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-gradient-to-br from-tertiary to-white" }, _attrs))}><header class="pt-24 pb-16 px-6 flex flex-col md:flex-row items-center gap-10 max-w-6xl mx-auto"><div class="flex-1"><h1 class="text-primary text-6xl font-semibold leading-tight mb-1">Faso Agri</h1><p class="text-secondary text-2xl font-medium mb-5 leading-snug"> Vendez, achetez et interagisseez avec les acteurs des secteurs agro-pastoraux.<br>Depuis votre localité. </p><p class="text-gray-500 text-md leading-relaxed mb-7"> Producteurs, éleveurs, acteurs du secteur - trouvez des acheteurs, des vétérinaires et les bons prix du marché. Tout ça depuis votre téléphone, partout au Burkina Faso. </p><button class="bg-primary text-white px-7 py-3 rounded-lg text-base font-medium hover:bg-secondary transition-colors duration-300"> Télécharger gratuitement </button><div class="flex gap-8 pt-6 mt-6 border-t border-gray-100"><!--[-->`);
      ssrRenderList(stats, (stat) => {
        _push(`<div><div class="text-2xl font-semibold text-primary">${ssrInterpolate(stat.value)}</div><div class="text-xs text-gray-500 mt-0.5">${ssrInterpolate(stat.label)}</div></div>`);
      });
      _push(`<!--]--></div></div><div class="flex-1 flex flex-col items-center justify-center gap-4">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: screenshots[currentIndex.value],
        alt: `screenshot ${currentIndex.value + 1}`,
        class: "w-58 md:w-48 lg:w-56 rounded-2xl shadow-lg transition-all duration-300"
      }, null, _parent));
      _push(`<div class="flex gap-2"><!--[-->`);
      ssrRenderList(screenshots, (_, i) => {
        _push(`<button${ssrRenderAttr("aria-label", `Aller à la capture d'écran ${i + 1}`)} class="${ssrRenderClass([i === currentIndex.value ? "bg-primary" : "bg-gray-300 hover:bg-secondary", "w-2 h-2 rounded-full transition-all duration-300"])}"></button>`);
      });
      _push(`<!--]--></div></div></header></div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/landing/HeroSection.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "FeaturesSection",
  __ssrInlineRender: true,
  setup(__props) {
    const IconMarche = defineComponent({
      render: () => h("svg", { class: "w-5 h-5", viewBox: "0 0 20 20", fill: "none", stroke: "#3B6D11", "stroke-width": "1.5" }, [
        h("rect", { x: "2", y: "4", width: "16", height: "12", rx: "2" }),
        h("path", { d: "M6 8h8M6 11h5" })
      ])
    });
    const IconAnnuaire = defineComponent({
      render: () => h("svg", { class: "w-5 h-5", viewBox: "0 0 20 20", fill: "none", stroke: "#0F6E56", "stroke-width": "1.5" }, [
        h("circle", { cx: "10", cy: "7", r: "3" }),
        h("path", { d: "M4 16c0-3.3 2.7-6 6-6s6 2.7 6 6" })
      ])
    });
    const IconEvenements = defineComponent({
      render: () => h("svg", { class: "w-5 h-5", viewBox: "0 0 20 20", fill: "none", stroke: "#854F0B", "stroke-width": "1.5" }, [
        h("rect", { x: "3", y: "4", width: "14", height: "13", rx: "2" }),
        h("path", { d: "M7 2v4M13 2v4M3 9h14" })
      ])
    });
    const IconInfos = defineComponent({
      render: () => h("svg", { class: "w-5 h-5", viewBox: "0 0 20 20", fill: "none", stroke: "#185FA5", "stroke-width": "1.5" }, [
        h("path", { d: "M4 5h12M4 9h8M4 13h10" })
      ])
    });
    const features = [
      {
        title: "Marché agricole",
        description: "Achetez et vendez vos produits entre producteurs et acheteurs.",
        iconBg: "bg-green-100",
        icon: IconMarche
      },
      {
        title: "Événements",
        description: "Découvrez foires, formations et rencontres agricoles.",
        iconBg: "bg-amber-100",
        icon: IconEvenements
      },
      {
        title: "Annuaire",
        description: "Trouvez vétérinaires, fournisseurs et techniciens près de chez vous.",
        iconBg: "bg-emerald-100",
        icon: IconAnnuaire
      },
      {
        title: "Astuces & conseils",
        description: "Guides techniques, conseils et forum d'échange.",
        iconBg: "bg-blue-100",
        icon: IconInfos
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "features",
        class: "py-16 px-6 bg-gray-50"
      }, _attrs))}><div class="max-w-6xl mx-auto"><div class="text-sm font-semibold text-primary uppercase tracking-wider mb-2"> Ce que vous pouvez faire </div><h2 class="text-3xl font-semibold mb-2">Tout ce dont un acteur du secteur agro-pastoral, ou un amateur a besoin</h2><p class="text-gray-500 mb-9">Quatre modules conçus pour le terrain burkinabè</p><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"><!--[-->`);
      ssrRenderList(features, (feature) => {
        _push(`<div class="bg-white p-5 rounded-xl border border-gray-300"><div class="${ssrRenderClass([feature.iconBg, "w-10 h-10 rounded-lg flex items-center justify-center mb-3.5"])}">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(feature.icon), null, null), _parent);
        _push(`</div><div class="font-semibold text-md mb-2">${ssrInterpolate(feature.title)}</div><div class="text-sm text-gray-500">${ssrInterpolate(feature.description)}</div></div>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/landing/FeaturesSection.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "WhySection",
  __ssrInlineRender: true,
  setup(__props) {
    const points = [
      "Interface simple, et fluidifiée pour les utilisateurs de tous âges",
      "Données locales : prix du marché, professionnels proches",
      "100% gratuit",
      "100% burkinabè, pour les acteurs locaux"
    ];
    const stats = [
      { value: "17", label: "Régions du Burkina Faso" },
      { value: "4", label: "Modules disponibles" },
      { value: "100%", label: "Gratuit et accessible" },
      { value: "1", label: "App, tout en un" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "about",
        class: "py-16 px-6"
      }, _attrs))}><div class="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-start"><div class="flex-1"><div class="text-sm font-semibold text-primary uppercase tracking-wider mb-2"> Pourquoi Faso Agri </div><h2 class="text-3xl font-semibold mb-2 leading-tight"> Conçu pour<br>le terrain burkinabè </h2><p class="text-gray-500 text-sm mb-8"> Une solution numérique pensée pour faciliter les échanges agro-pastoraux au Burkina Faso. </p><div class="space-y-3"><!--[-->`);
      ssrRenderList(points, (point) => {
        _push(`<div class="flex items-start gap-3 bg-gray-50 border border-gray-300 rounded-xl p-4"><div class="w-7 h-7 rounded-full bg-tertiary flex items-center justify-center flex-shrink-0 mt-0.5"><svg class="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="#3B6D11" stroke-width="1.5"><path d="M2 7l3 3 7-6"></path></svg></div><span class="text-sm leading-relaxed">${ssrInterpolate(point)}</span></div>`);
      });
      _push(`<!--]--></div></div><div class="hidden lg:block w-px bg-gray-200 self-stretch"></div><div class="flex-1 grid grid-cols-2 gap-3"><!--[-->`);
      ssrRenderList(stats, (stat, index) => {
        _push(`<div class="${ssrRenderClass([index % 3 === 0 ? "bg-primary border-primary text-white" : "bg-white border-gray-300", "p-5 rounded-xl border"])}"><div class="${ssrRenderClass([index % 3 === 0 ? "text-white" : "text-primary", "text-4xl font-semibold mb-1.5"])}">${ssrInterpolate(stat.value)}</div><div class="${ssrRenderClass([index % 3 === 0 ? "text-white/75" : "text-gray-500", "text-xs leading-snug"])}">${ssrInterpolate(stat.label)}</div></div>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/landing/WhySection.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<section${ssrRenderAttrs(mergeProps({
    id: "download",
    class: "py-16 px-6 bg-secondary text-center"
  }, _attrs))}><div class="max-w-2xl mx-auto"><h2 class="text-3xl font-semibold text-white mb-2">Prêt à rejoindre Faso Agri ?</h2><p class="text-white/80 mb-7">Téléchargez l&#39;application et connectez-vous à la de chaîne de valeur agro-pastorale</p><div class="flex gap-4 justify-center flex-wrap"><a href="#" class="bg-white px-5 py-3 rounded-xl flex items-center gap-2.5 hover:opacity-90 transition-opacity"><svg class="w-6 h-6" viewBox="0 0 24 24" fill="black"><path d="M3 20.5v-17l18 8.5-18 8.5z"></path></svg><div class="text-left"><div class="text-[10px] text-gray-500">Disponible sur</div><div class="text-sm font-semibold">Google Play</div></div></a><a href="#" class="bg-white px-5 py-3 rounded-xl flex items-center gap-2.5 hover:opacity-90 transition-opacity"><svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg><div class="text-left"><div class="text-[10px] text-gray-500">Télécharger l&#39;</div><div class="text-sm font-semibold">APK direct</div></div></a></div></div></section>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/landing/DownloadCTA.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Faso Agri - Le réseau social de chaîne de valeur agro-pastorale",
      description: "Faso Agri connecte producteurs, éleveurs, acheteurs et professionnels de l'agriculture burkinabè en un seul endroit.",
      ogImage: "/images/logo.png"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LandingAppNav = __nuxt_component_0;
      const _component_LandingHeroSection = _sfc_main$4;
      const _component_LandingFeaturesSection = _sfc_main$3;
      const _component_LandingWhySection = _sfc_main$2;
      const _component_LandingDownloadCTA = __nuxt_component_4;
      const _component_LandingAppFooter = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "font-sans" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_LandingAppNav, null, null, _parent));
      _push(ssrRenderComponent(_component_LandingHeroSection, null, null, _parent));
      _push(ssrRenderComponent(_component_LandingFeaturesSection, null, null, _parent));
      _push(ssrRenderComponent(_component_LandingWhySection, null, null, _parent));
      _push(ssrRenderComponent(_component_LandingDownloadCTA, null, null, _parent));
      _push(ssrRenderComponent(_component_LandingAppFooter, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-CHit6xPB.js.map
