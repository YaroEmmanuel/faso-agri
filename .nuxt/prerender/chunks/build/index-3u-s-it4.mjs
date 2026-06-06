import { _ as _sfc_main$2 } from './AdminLayout-Ah3JggTO.mjs';
import { defineComponent, ref, computed, withCtx, unref, createTextVNode, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, h, mergeProps, resolveDynamicComponent, useSSRContext } from 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/vue/index.mjs';
import { ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttrs, ssrRenderVNode } from 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/vue/server-renderer/index.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-CkXNCsDJ.mjs';
import { u as useNuxtApp } from './server.mjs';
import { u as useSeoMeta } from './v3-BR0C_1wp.mjs';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/ufo/dist/index.mjs';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/ofetch/dist/node.mjs';
import '../_/nitro.mjs';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/h3/dist/index.mjs';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/destr/dist/index.mjs';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/hookable/dist/index.mjs';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/node-mock-http/dist/index.mjs';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/klona/dist/index.mjs';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/defu/dist/defu.mjs';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/scule/dist/index.mjs';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/radix3/dist/index.mjs';
import 'node:fs';
import 'node:url';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/pathe/dist/index.mjs';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/ipx/dist/index.mjs';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/unstorage/dist/index.mjs';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/unstorage/drivers/fs.mjs';
import 'file:///C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/@nuxt/nitro-server/dist/runtime/utils/cache-driver.js';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/unstorage/drivers/fs-lite.mjs';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/ohash/dist/index.mjs';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/unctx/dist/index.mjs';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/vue-router/vue-router.node.mjs';
import '../_/renderer.mjs';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/unhead/dist/server.mjs';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/devalue/index.js';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/unhead/dist/plugins.mjs';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/unhead/dist/utils.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AdminStatCard",
  __ssrInlineRender: true,
  props: {
    label: {},
    value: {},
    iconKey: {},
    loading: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const icons = {
      users: defineComponent({ render: () => h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.75",
          d: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
        })
      ]) }),
      products: defineComponent({ render: () => h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.75",
          d: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"
        })
      ]) }),
      events: defineComponent({ render: () => h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.75",
          d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        })
      ]) }),
      forum: defineComponent({ render: () => h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.75",
          d: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
        })
      ]) })
    };
    const palette = {
      users: { bg: "bg-blue-50", color: "text-blue-600" },
      products: { bg: "bg-green-50", color: "text-green-700" },
      events: { bg: "bg-amber-50", color: "text-amber-600" },
      forum: { bg: "bg-violet-50", color: "text-violet-600" }
    };
    const svgIcon = computed(() => icons[props.iconKey]);
    const iconBg = computed(() => palette[props.iconKey].bg);
    const iconColor = computed(() => palette[props.iconKey].color);
    const formattedValue = computed(
      () => props.value >= 1e3 ? (props.value / 1e3).toFixed(1) + "k" : String(props.value)
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4" }, _attrs))}>`);
      if (__props.loading) {
        _push(`<div class="space-y-3"><div class="h-3 w-20 bg-gray-100 rounded-full animate-pulse"></div><div class="h-8 w-24 bg-gray-100 rounded-full animate-pulse"></div></div>`);
      } else {
        _push(`<!--[--><div class="flex items-center justify-between"><p class="text-xs font-medium text-gray-400 uppercase tracking-widest">${ssrInterpolate(__props.label)}</p><div class="${ssrRenderClass([unref(iconBg), "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"])}">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(svgIcon)), {
          class: [unref(iconColor), "w-[18px] h-[18px]"]
        }, null), _parent);
        _push(`</div></div><div><p class="text-3xl font-bold text-gray-900 tracking-tight">${ssrInterpolate(unref(formattedValue))}</p></div><!--]-->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/AdminStatCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { $firestore } = useNuxtApp();
    useSeoMeta({ title: "Tableau de bord \u2014 Admin Faso Agri" });
    const statsLoading = ref(false);
    const globalStats = ref({ totalUsers: 0, totalProducts: 0, totalEvents: 0, totalForumTopics: 0 });
    const stats = computed(() => [
      { label: "Utilisateurs", value: globalStats.value.totalUsers, iconKey: "users" },
      { label: "Produits", value: globalStats.value.totalProducts, iconKey: "products" },
      { label: "\xC9v\xE9nements", value: globalStats.value.totalEvents, iconKey: "events" },
      { label: "Sujets du forum", value: globalStats.value.totalForumTopics, iconKey: "forum" }
    ]);
    const recentLoading = ref(false);
    const recentItems = ref([]);
    const typeConfig = {
      news: { label: "Actualit\xE9", badge: "bg-blue-50 text-blue-700", dot: "bg-blue-400" },
      advice: { label: "Conseil", badge: "bg-amber-50 text-amber-700", dot: "bg-amber-400" },
      alert: { label: "Alerte", badge: "bg-red-50 text-red-600", dot: "bg-red-400" },
      announcement: { label: "Annonce", badge: "bg-green-50 text-green-700", dot: "bg-green-400" }
    };
    function badgeClass(type) {
      var _a, _b;
      return (_b = (_a = typeConfig[type]) == null ? void 0 : _a.badge) != null ? _b : "bg-gray-100 text-gray-500";
    }
    function dotClass(type) {
      var _a, _b;
      return (_b = (_a = typeConfig[type]) == null ? void 0 : _a.dot) != null ? _b : "bg-gray-300";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AdminLayout = _sfc_main$2;
      const _component_AdminStatCard = _sfc_main$1;
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(_component_AdminLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-7"${_scopeId}><div${_scopeId}><h1 class="text-xl font-bold text-gray-900"${_scopeId}>Tableau de bord</h1><p class="text-sm text-gray-400 mt-0.5"${_scopeId}>Vue d&#39;ensemble de la plateforme Faso Agri</p></div><div class="grid grid-cols-2 lg:grid-cols-4 gap-4"${_scopeId}><!--[-->`);
            ssrRenderList(unref(stats), (stat) => {
              _push2(ssrRenderComponent(_component_AdminStatCard, {
                key: stat.label,
                label: stat.label,
                value: stat.value,
                "icon-key": stat.iconKey,
                loading: unref(statsLoading)
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]--></div><div class="bg-white rounded-2xl border border-gray-100 overflow-hidden"${_scopeId}><div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between"${_scopeId}><div${_scopeId}><h2 class="text-sm font-semibold text-gray-900"${_scopeId}>Derni\xE8res publications</h2><p class="text-xs text-gray-400 mt-0.5"${_scopeId}>5 publications r\xE9centes de la plateforme</p></div>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/admin/publications",
              class: "text-xs font-medium text-primary hover:underline underline-offset-2 transition"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Voir tout `);
                } else {
                  return [
                    createTextVNode(" Voir tout ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            if (unref(recentLoading)) {
              _push2(`<div class="divide-y divide-gray-50"${_scopeId}><!--[-->`);
              ssrRenderList(5, (i) => {
                _push2(`<div class="px-6 py-4 flex items-center gap-4"${_scopeId}><div class="h-3 w-3 rounded-full bg-gray-100 animate-pulse"${_scopeId}></div><div class="flex-1 h-3 bg-gray-100 rounded animate-pulse"${_scopeId}></div><div class="h-3 w-16 bg-gray-100 rounded animate-pulse"${_scopeId}></div><div class="h-5 w-20 bg-gray-100 rounded-full animate-pulse"${_scopeId}></div></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="divide-y divide-gray-50"${_scopeId}><!--[-->`);
              ssrRenderList(unref(recentItems), (item) => {
                _push2(`<div class="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/60 transition"${_scopeId}><div class="${ssrRenderClass([dotClass(item.type), "w-2 h-2 rounded-full flex-shrink-0"])}"${_scopeId}></div><p class="flex-1 text-sm text-gray-700 font-medium truncate"${_scopeId}>${ssrInterpolate(item.title)}</p><span class="text-xs text-gray-400 flex-shrink-0 hidden sm:block"${_scopeId}>${ssrInterpolate(item.date)}</span><span class="${ssrRenderClass([badgeClass(item.type), "text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0"])}"${_scopeId}>${ssrInterpolate(item.typeLabel)}</span></div>`);
              });
              _push2(`<!--]-->`);
              if (unref(recentItems).length === 0) {
                _push2(`<div class="px-6 py-10 text-center text-sm text-gray-400"${_scopeId}> Aucune publication pour le moment. </div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-7" }, [
                createVNode("div", null, [
                  createVNode("h1", { class: "text-xl font-bold text-gray-900" }, "Tableau de bord"),
                  createVNode("p", { class: "text-sm text-gray-400 mt-0.5" }, "Vue d'ensemble de la plateforme Faso Agri")
                ]),
                createVNode("div", { class: "grid grid-cols-2 lg:grid-cols-4 gap-4" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(stats), (stat) => {
                    return openBlock(), createBlock(_component_AdminStatCard, {
                      key: stat.label,
                      label: stat.label,
                      value: stat.value,
                      "icon-key": stat.iconKey,
                      loading: unref(statsLoading)
                    }, null, 8, ["label", "value", "icon-key", "loading"]);
                  }), 128))
                ]),
                createVNode("div", { class: "bg-white rounded-2xl border border-gray-100 overflow-hidden" }, [
                  createVNode("div", { class: "px-6 py-4 border-b border-gray-100 flex items-center justify-between" }, [
                    createVNode("div", null, [
                      createVNode("h2", { class: "text-sm font-semibold text-gray-900" }, "Derni\xE8res publications"),
                      createVNode("p", { class: "text-xs text-gray-400 mt-0.5" }, "5 publications r\xE9centes de la plateforme")
                    ]),
                    createVNode(_component_NuxtLink, {
                      to: "/admin/publications",
                      class: "text-xs font-medium text-primary hover:underline underline-offset-2 transition"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Voir tout ")
                      ]),
                      _: 1
                    })
                  ]),
                  unref(recentLoading) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "divide-y divide-gray-50"
                  }, [
                    (openBlock(), createBlock(Fragment, null, renderList(5, (i) => {
                      return createVNode("div", {
                        key: i,
                        class: "px-6 py-4 flex items-center gap-4"
                      }, [
                        createVNode("div", { class: "h-3 w-3 rounded-full bg-gray-100 animate-pulse" }),
                        createVNode("div", { class: "flex-1 h-3 bg-gray-100 rounded animate-pulse" }),
                        createVNode("div", { class: "h-3 w-16 bg-gray-100 rounded animate-pulse" }),
                        createVNode("div", { class: "h-5 w-20 bg-gray-100 rounded-full animate-pulse" })
                      ]);
                    }), 64))
                  ])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "divide-y divide-gray-50"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(recentItems), (item) => {
                      return openBlock(), createBlock("div", {
                        key: item.id,
                        class: "px-6 py-4 flex items-center gap-4 hover:bg-gray-50/60 transition"
                      }, [
                        createVNode("div", {
                          class: [dotClass(item.type), "w-2 h-2 rounded-full flex-shrink-0"]
                        }, null, 2),
                        createVNode("p", { class: "flex-1 text-sm text-gray-700 font-medium truncate" }, toDisplayString(item.title), 1),
                        createVNode("span", { class: "text-xs text-gray-400 flex-shrink-0 hidden sm:block" }, toDisplayString(item.date), 1),
                        createVNode("span", {
                          class: [badgeClass(item.type), "text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0"]
                        }, toDisplayString(item.typeLabel), 3)
                      ]);
                    }), 128)),
                    unref(recentItems).length === 0 ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "px-6 py-10 text-center text-sm text-gray-400"
                    }, " Aucune publication pour le moment. ")) : createCommentVNode("", true)
                  ]))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-3u-s-it4.mjs.map
