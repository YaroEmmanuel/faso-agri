import { _ as _sfc_main$1 } from "./AdminLayout-Ah3JggTO.js";
import { defineComponent, ref, computed, watch, withCtx, unref, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, withDirectives, isRef, vModelText, vModelSelect, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { u as useNuxtApp } from "../server.mjs";
import { a as useSeoMeta } from "./v3-BR0C_1wp.js";
import "./nuxt-link-CkXNCsDJ.js";
import "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/ufo/dist/index.mjs";
import "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/defu/dist/defu.mjs";
import "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/hookable/dist/index.mjs";
import "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/unctx/dist/index.mjs";
import "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/@unhead/vue/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { $firestore } = useNuxtApp();
    useSeoMeta({ title: "Catalogue — Admin Faso Agri" });
    const tabs = [{ key: "products", label: "Produits" }, { key: "events", label: "Événements" }];
    const activeTab = ref("products");
    const search = ref("");
    const filterCategory = ref("");
    const filterStatus = ref("");
    const loading = ref(false);
    const items = ref([]);
    const collectionName = computed(() => activeTab.value === "products" ? "products" : "events");
    const filteredItems = computed(() => {
      const term = search.value.toLowerCase();
      return items.value.filter((i) => {
        const text = (i.name || i.title || "").toLowerCase();
        const matchSearch = !term || text.includes(term);
        const matchCat = !filterCategory.value || i.category === filterCategory.value;
        const matchStatus = !filterStatus.value || i.status === filterStatus.value;
        return matchSearch && matchCat && matchStatus;
      });
    });
    function statusBadge(s) {
      const m = { published: "bg-green-50 text-green-700", draft: "bg-amber-50 text-amber-700", archived: "bg-gray-100 text-gray-400", ended: "bg-red-50 text-red-500" };
      return m[s] ?? "bg-gray-100 text-gray-500";
    }
    function statusLabel(s) {
      const m = { published: "Publié", draft: "Brouillon", archived: "Archivé", ended: "Terminé" };
      return m[s] ?? s;
    }
    function formatDate(ts) {
      if (!ts) return "—";
      const d = ts.toDate ? ts.toDate() : new Date(ts);
      return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
    }
    const fallbackProducts = [
      { id: "1", name: "Sacs d'engrais NPK 50kg", category: "intrants", price: 25e3, region: "Centre", status: "published" },
      { id: "2", name: "Semences de sorgho certifiées", category: "semences", price: 8e3, region: "Sahel", status: "published" },
      { id: "3", name: "Houe manga améliorée", category: "materiels", price: 15e3, region: "Hauts-Bassins", status: "draft" },
      { id: "4", name: "Mil local — sac 100kg", category: "recoltes", price: 18e3, region: "Nord", status: "published" }
    ];
    const fallbackEvents = [
      { id: "1", title: "Foire agricole de Bobo 2026", location: "Bobo-Dioulasso", region: "Hauts-Bassins", status: "published", date: null },
      { id: "2", title: "Formation irrigation — Koudougou", location: "Koudougou", region: "Centre-Ouest", status: "published", date: null }
    ];
    async function loadItems() {
      if (!$firestore) {
        items.value = activeTab.value === "products" ? fallbackProducts : fallbackEvents;
        return;
      }
      loading.value = true;
      try {
        const { collection, query, orderBy, getDocs } = await import("firebase/firestore");
        const fs = $firestore;
        const q = query(collection(fs, collectionName.value), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        items.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      } finally {
        loading.value = false;
      }
    }
    watch(activeTab, () => {
      search.value = "";
      filterCategory.value = "";
      filterStatus.value = "";
      loadItems();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AdminLayout = _sfc_main$1;
      _push(ssrRenderComponent(_component_AdminLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-5"${_scopeId}><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"${_scopeId}><div${_scopeId}><h1 class="text-xl font-bold text-gray-900"${_scopeId}>Catalogue</h1><p class="text-sm text-gray-400 mt-0.5"${_scopeId}>Produits agricoles et événements</p></div></div><div class="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit"${_scopeId}><!--[-->`);
            ssrRenderList(tabs, (tab) => {
              _push2(`<button class="${ssrRenderClass([unref(activeTab) === tab.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600", "px-5 py-1.5 rounded-lg text-sm font-medium transition"])}"${_scopeId}>${ssrInterpolate(tab.label)}</button>`);
            });
            _push2(`<!--]--></div><div class="flex flex-wrap gap-3"${_scopeId}><input${ssrRenderAttr("value", unref(search))} type="text" placeholder="Rechercher…" class="flex-1 min-w-48 px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"${_scopeId}>`);
            if (unref(activeTab) === "products") {
              _push2(`<select class="px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterCategory)) ? ssrLooseContain(unref(filterCategory), "") : ssrLooseEqual(unref(filterCategory), "")) ? " selected" : ""}${_scopeId}>Toutes les catégories</option><option value="intrants"${ssrIncludeBooleanAttr(Array.isArray(unref(filterCategory)) ? ssrLooseContain(unref(filterCategory), "intrants") : ssrLooseEqual(unref(filterCategory), "intrants")) ? " selected" : ""}${_scopeId}>Intrants</option><option value="semences"${ssrIncludeBooleanAttr(Array.isArray(unref(filterCategory)) ? ssrLooseContain(unref(filterCategory), "semences") : ssrLooseEqual(unref(filterCategory), "semences")) ? " selected" : ""}${_scopeId}>Semences</option><option value="materiels"${ssrIncludeBooleanAttr(Array.isArray(unref(filterCategory)) ? ssrLooseContain(unref(filterCategory), "materiels") : ssrLooseEqual(unref(filterCategory), "materiels")) ? " selected" : ""}${_scopeId}>Matériels</option><option value="recoltes"${ssrIncludeBooleanAttr(Array.isArray(unref(filterCategory)) ? ssrLooseContain(unref(filterCategory), "recoltes") : ssrLooseEqual(unref(filterCategory), "recoltes")) ? " selected" : ""}${_scopeId}>Produits récoltés</option></select>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<select class="px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "") : ssrLooseEqual(unref(filterStatus), "")) ? " selected" : ""}${_scopeId}>Tous les statuts</option><option value="published"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "published") : ssrLooseEqual(unref(filterStatus), "published")) ? " selected" : ""}${_scopeId}>Publié</option><option value="draft"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "draft") : ssrLooseEqual(unref(filterStatus), "draft")) ? " selected" : ""}${_scopeId}>Brouillon</option><option value="archived"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "archived") : ssrLooseEqual(unref(filterStatus), "archived")) ? " selected" : ""}${_scopeId}>Archivé</option></select></div><div class="bg-white rounded-2xl border border-gray-100 overflow-hidden"${_scopeId}>`);
            if (unref(loading)) {
              _push2(`<div class="p-6 space-y-3"${_scopeId}><!--[-->`);
              ssrRenderList(6, (i) => {
                _push2(`<div class="h-14 bg-gray-100 rounded-xl animate-pulse"${_scopeId}></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<table class="w-full text-sm"${_scopeId}><thead${_scopeId}><tr class="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide"${_scopeId}><th class="text-left px-5 py-3 font-medium"${_scopeId}>${ssrInterpolate(unref(activeTab) === "products" ? "Produit" : "Événement")}</th><th class="text-left px-5 py-3 font-medium hidden md:table-cell"${_scopeId}>${ssrInterpolate(unref(activeTab) === "products" ? "Catégorie" : "Date")}</th><th class="text-left px-5 py-3 font-medium hidden lg:table-cell"${_scopeId}>Région</th><th class="text-left px-5 py-3 font-medium"${_scopeId}>Statut</th></tr></thead><tbody${_scopeId}><!--[-->`);
              ssrRenderList(unref(filteredItems), (item) => {
                _push2(`<tr class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition"${_scopeId}><td class="px-5 py-3.5"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center"${_scopeId}>`);
                if (item.imageBase64) {
                  _push2(`<img${ssrRenderAttr("src", `data:image/jpeg;base64,${item.imageBase64}`)} class="w-full h-full object-cover" alt=""${_scopeId}>`);
                } else {
                  _push2(`<svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"${_scopeId}></path></svg>`);
                }
                _push2(`</div><div class="min-w-0"${_scopeId}><p class="font-medium text-gray-900 truncate"${_scopeId}>${ssrInterpolate(item.name || item.title)}</p><p class="text-xs text-gray-400"${_scopeId}>${ssrInterpolate(unref(activeTab) === "products" ? item.price + " FCFA" : item.location)}</p></div></div></td><td class="px-5 py-3.5 text-gray-500 hidden md:table-cell capitalize"${_scopeId}>${ssrInterpolate(unref(activeTab) === "products" ? item.category || "—" : formatDate(item.date))}</td><td class="px-5 py-3.5 text-gray-400 hidden lg:table-cell"${_scopeId}>${ssrInterpolate(item.region || "—")}</td><td class="px-5 py-3.5"${_scopeId}><span class="${ssrRenderClass([statusBadge(item.status), "text-xs px-2.5 py-1 rounded-full font-medium"])}"${_scopeId}>${ssrInterpolate(statusLabel(item.status))}</span></td></tr>`);
              });
              _push2(`<!--]-->`);
              if (unref(filteredItems).length === 0) {
                _push2(`<tr${_scopeId}><td colspan="4" class="px-5 py-10 text-center text-sm text-gray-400"${_scopeId}>Aucun élément trouvé.</td></tr>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</tbody></table>`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-5" }, [
                createVNode("div", { class: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-xl font-bold text-gray-900" }, "Catalogue"),
                    createVNode("p", { class: "text-sm text-gray-400 mt-0.5" }, "Produits agricoles et événements")
                  ])
                ]),
                createVNode("div", { class: "flex gap-1 bg-gray-100 rounded-xl p-1 w-fit" }, [
                  (openBlock(), createBlock(Fragment, null, renderList(tabs, (tab) => {
                    return createVNode("button", {
                      key: tab.key,
                      onClick: ($event) => activeTab.value = tab.key,
                      class: [unref(activeTab) === tab.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600", "px-5 py-1.5 rounded-lg text-sm font-medium transition"]
                    }, toDisplayString(tab.label), 11, ["onClick"]);
                  }), 64))
                ]),
                createVNode("div", { class: "flex flex-wrap gap-3" }, [
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
                    type: "text",
                    placeholder: "Rechercher…",
                    class: "flex-1 min-w-48 px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(search)]
                  ]),
                  unref(activeTab) === "products" ? withDirectives((openBlock(), createBlock("select", {
                    key: 0,
                    "onUpdate:modelValue": ($event) => isRef(filterCategory) ? filterCategory.value = $event : null,
                    class: "px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  }, [
                    createVNode("option", { value: "" }, "Toutes les catégories"),
                    createVNode("option", { value: "intrants" }, "Intrants"),
                    createVNode("option", { value: "semences" }, "Semences"),
                    createVNode("option", { value: "materiels" }, "Matériels"),
                    createVNode("option", { value: "recoltes" }, "Produits récoltés")
                  ], 8, ["onUpdate:modelValue"])), [
                    [vModelSelect, unref(filterCategory)]
                  ]) : createCommentVNode("", true),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => isRef(filterStatus) ? filterStatus.value = $event : null,
                    class: "px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  }, [
                    createVNode("option", { value: "" }, "Tous les statuts"),
                    createVNode("option", { value: "published" }, "Publié"),
                    createVNode("option", { value: "draft" }, "Brouillon"),
                    createVNode("option", { value: "archived" }, "Archivé")
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, unref(filterStatus)]
                  ])
                ]),
                createVNode("div", { class: "bg-white rounded-2xl border border-gray-100 overflow-hidden" }, [
                  unref(loading) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "p-6 space-y-3"
                  }, [
                    (openBlock(), createBlock(Fragment, null, renderList(6, (i) => {
                      return createVNode("div", {
                        key: i,
                        class: "h-14 bg-gray-100 rounded-xl animate-pulse"
                      });
                    }), 64))
                  ])) : (openBlock(), createBlock("table", {
                    key: 1,
                    class: "w-full text-sm"
                  }, [
                    createVNode("thead", null, [
                      createVNode("tr", { class: "border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide" }, [
                        createVNode("th", { class: "text-left px-5 py-3 font-medium" }, toDisplayString(unref(activeTab) === "products" ? "Produit" : "Événement"), 1),
                        createVNode("th", { class: "text-left px-5 py-3 font-medium hidden md:table-cell" }, toDisplayString(unref(activeTab) === "products" ? "Catégorie" : "Date"), 1),
                        createVNode("th", { class: "text-left px-5 py-3 font-medium hidden lg:table-cell" }, "Région"),
                        createVNode("th", { class: "text-left px-5 py-3 font-medium" }, "Statut")
                      ])
                    ]),
                    createVNode("tbody", null, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(filteredItems), (item) => {
                        return openBlock(), createBlock("tr", {
                          key: item.id,
                          class: "border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition"
                        }, [
                          createVNode("td", { class: "px-5 py-3.5" }, [
                            createVNode("div", { class: "flex items-center gap-3" }, [
                              createVNode("div", { class: "w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center" }, [
                                item.imageBase64 ? (openBlock(), createBlock("img", {
                                  key: 0,
                                  src: `data:image/jpeg;base64,${item.imageBase64}`,
                                  class: "w-full h-full object-cover",
                                  alt: ""
                                }, null, 8, ["src"])) : (openBlock(), createBlock("svg", {
                                  key: 1,
                                  class: "w-5 h-5 text-gray-300",
                                  fill: "none",
                                  stroke: "currentColor",
                                  viewBox: "0 0 24 24"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    "stroke-width": "1.5",
                                    d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  })
                                ]))
                              ]),
                              createVNode("div", { class: "min-w-0" }, [
                                createVNode("p", { class: "font-medium text-gray-900 truncate" }, toDisplayString(item.name || item.title), 1),
                                createVNode("p", { class: "text-xs text-gray-400" }, toDisplayString(unref(activeTab) === "products" ? item.price + " FCFA" : item.location), 1)
                              ])
                            ])
                          ]),
                          createVNode("td", { class: "px-5 py-3.5 text-gray-500 hidden md:table-cell capitalize" }, toDisplayString(unref(activeTab) === "products" ? item.category || "—" : formatDate(item.date)), 1),
                          createVNode("td", { class: "px-5 py-3.5 text-gray-400 hidden lg:table-cell" }, toDisplayString(item.region || "—"), 1),
                          createVNode("td", { class: "px-5 py-3.5" }, [
                            createVNode("span", {
                              class: [statusBadge(item.status), "text-xs px-2.5 py-1 rounded-full font-medium"]
                            }, toDisplayString(statusLabel(item.status)), 3)
                          ])
                        ]);
                      }), 128)),
                      unref(filteredItems).length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", {
                          colspan: "4",
                          class: "px-5 py-10 text-center text-sm text-gray-400"
                        }, "Aucun élément trouvé.")
                      ])) : createCommentVNode("", true)
                    ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/catalog/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-DYb6H3Dk.js.map
