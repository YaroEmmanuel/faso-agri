import { _ as _sfc_main$1 } from './AdminLayout-Ah3JggTO.mjs';
import { defineComponent, ref, computed, withCtx, unref, createVNode, toDisplayString, openBlock, createBlock, createTextVNode, withDirectives, isRef, vModelText, Fragment, renderList, vModelSelect, createCommentVNode, useSSRContext } from 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/vue/index.mjs';
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderClass } from 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/vue/server-renderer/index.mjs';
import { u as useNuxtApp } from './server.mjs';
import { u as useSeoMeta } from './v3-BR0C_1wp.mjs';
import './nuxt-link-CkXNCsDJ.mjs';
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

const PAGE_SIZE = 20;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { $firestore } = useNuxtApp();
    useSeoMeta({ title: "Utilisateurs \u2014 Admin Faso Agri" });
    const regions = ["Centre", "Hauts-Bassins", "Cascades", "Est", "Nord", "Centre-Nord", "Centre-Ouest", "Centre-Est", "Boucle du Mouhoun", "Sahel", "Sud-Ouest", "Plateau-Central", "Centre-Sud"];
    const users = ref([]);
    const loading = ref(false);
    const page = ref(1);
    const hasMore = ref(false);
    const totalCount = ref(0);
    const lastDoc = ref(null);
    const search = ref("");
    const filterRegion = ref("");
    const filterStatus = ref("");
    const filteredUsers = computed(
      () => users.value.filter((u) => {
        var _a, _b;
        const matchSearch = !search.value || ((_a = u.displayName) == null ? void 0 : _a.toLowerCase().includes(search.value.toLowerCase())) || ((_b = u.email) == null ? void 0 : _b.toLowerCase().includes(search.value.toLowerCase()));
        const matchRegion = !filterRegion.value || u.region === filterRegion.value;
        const matchStatus = !filterStatus.value || u.status === filterStatus.value;
        return matchSearch && matchRegion && matchStatus;
      })
    );
    function initials(name) {
      return name ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() : "?";
    }
    function formatDate(ts) {
      if (!ts) return "\u2014";
      const d = ts.toDate ? ts.toDate() : new Date(ts);
      return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
    }
    const fallbackUsers = Array.from({ length: 12 }, (_, i) => ({
      id: String(i),
      displayName: ["Moussa Traor\xE9", "A\xEFcha Kon\xE9", "Ibrahim Sawadogo", "Fatou Diallo", "Adama Ou\xE9draogo", "Mariam Coulibaly", "Seydou Kabor\xE9", "Aminata Tapsoba", "Boubacar Zongo", "Kadiatou B\xE2", "Lassina Dao", "Rokia Sore"][i],
      email: `user${i + 1}@fasoagri.bf`,
      region: regions[i % regions.length],
      status: i % 5 === 0 ? "disabled" : "active",
      createdAt: null
    }));
    async function fetchPage(after) {
      var _a;
      if (!$firestore) {
        users.value = fallbackUsers;
        totalCount.value = fallbackUsers.length;
        hasMore.value = false;
        return;
      }
      loading.value = true;
      try {
        const { collection, query, orderBy, limit, startAfter, getDocs, getCountFromServer } = await import('file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/firebase/firestore/dist/index.mjs');
        const fs = $firestore;
        const constraints = [orderBy("createdAt", "desc"), limit(PAGE_SIZE)];
        if (after) constraints.push(startAfter(after));
        const q = query(collection(fs, "users"), ...constraints);
        const snap = await getDocs(q);
        users.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        hasMore.value = snap.docs.length === PAGE_SIZE;
        lastDoc.value = (_a = snap.docs[snap.docs.length - 1]) != null ? _a : null;
        const countSnap = await getCountFromServer(collection(fs, "users"));
        totalCount.value = countSnap.data().count;
      } finally {
        loading.value = false;
      }
    }
    async function nextPage() {
      if (!lastDoc.value) return;
      page.value++;
      await fetchPage(lastDoc.value);
    }
    async function prevPage() {
      if (page.value <= 1) return;
      page.value--;
      await fetchPage();
    }
    function exportCsv() {
      const headers = ["ID", "Nom", "Email", "R\xE9gion", "Statut", "Inscription"];
      const rows = filteredUsers.value.map((u) => [u.id, u.displayName, u.email, u.region, u.status, formatDate(u.createdAt)]);
      const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = (void 0).createElement("a");
      a.href = url;
      a.download = "utilisateurs.csv";
      a.click();
      URL.revokeObjectURL(url);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AdminLayout = _sfc_main$1;
      _push(ssrRenderComponent(_component_AdminLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-5"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><h1 class="text-xl font-bold text-gray-900"${_scopeId}>Utilisateurs</h1><p class="text-sm text-gray-400 mt-0.5"${_scopeId}>${ssrInterpolate(unref(totalCount))} comptes enregistr\xE9s</p></div><button class="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl px-4 py-2 hover:border-gray-300 transition"${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"${_scopeId}></path></svg> Exporter CSV </button></div><div class="flex flex-wrap gap-3"${_scopeId}><input${ssrRenderAttr("value", unref(search))} type="text" placeholder="Rechercher par nom ou email\u2026" class="flex-1 min-w-52 px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"${_scopeId}><select class="px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterRegion)) ? ssrLooseContain(unref(filterRegion), "") : ssrLooseEqual(unref(filterRegion), "")) ? " selected" : ""}${_scopeId}>Toutes les r\xE9gions</option><!--[-->`);
            ssrRenderList(regions, (r) => {
              _push2(`<option${ssrRenderAttr("value", r)}${ssrIncludeBooleanAttr(Array.isArray(unref(filterRegion)) ? ssrLooseContain(unref(filterRegion), r) : ssrLooseEqual(unref(filterRegion), r)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(r)}</option>`);
            });
            _push2(`<!--]--></select><select class="px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "") : ssrLooseEqual(unref(filterStatus), "")) ? " selected" : ""}${_scopeId}>Tous les statuts</option><option value="active"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "active") : ssrLooseEqual(unref(filterStatus), "active")) ? " selected" : ""}${_scopeId}>Actif</option><option value="disabled"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "disabled") : ssrLooseEqual(unref(filterStatus), "disabled")) ? " selected" : ""}${_scopeId}>D\xE9sactiv\xE9</option></select></div><div class="bg-white rounded-2xl border border-gray-100 overflow-hidden"${_scopeId}>`);
            if (unref(loading)) {
              _push2(`<div class="p-6 space-y-3"${_scopeId}><!--[-->`);
              ssrRenderList(8, (i) => {
                _push2(`<div class="h-10 bg-gray-100 rounded-xl animate-pulse"${_scopeId}></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<table class="w-full text-sm"${_scopeId}><thead${_scopeId}><tr class="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide"${_scopeId}><th class="text-left px-5 py-3 font-medium"${_scopeId}>Utilisateur</th><th class="text-left px-5 py-3 font-medium hidden md:table-cell"${_scopeId}>R\xE9gion</th><th class="text-left px-5 py-3 font-medium hidden lg:table-cell"${_scopeId}>Inscription</th><th class="text-left px-5 py-3 font-medium"${_scopeId}>Statut</th></tr></thead><tbody${_scopeId}><!--[-->`);
              ssrRenderList(unref(filteredUsers), (user) => {
                _push2(`<tr class="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition"${_scopeId}><td class="px-5 py-3.5"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0"${_scopeId}>${ssrInterpolate(initials(user.displayName))}</div><div${_scopeId}><p class="font-medium text-gray-900"${_scopeId}>${ssrInterpolate(user.displayName)}</p><p class="text-xs text-gray-400"${_scopeId}>${ssrInterpolate(user.email)}</p></div></div></td><td class="px-5 py-3.5 text-gray-500 hidden md:table-cell"${_scopeId}>${ssrInterpolate(user.region || "\u2014")}</td><td class="px-5 py-3.5 text-gray-400 hidden lg:table-cell"${_scopeId}>${ssrInterpolate(formatDate(user.createdAt))}</td><td class="px-5 py-3.5"${_scopeId}><span class="${ssrRenderClass([user.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500", "text-xs px-2.5 py-1 rounded-full font-medium"])}"${_scopeId}>${ssrInterpolate(user.status === "active" ? "Actif" : "D\xE9sactiv\xE9")}</span></td></tr>`);
              });
              _push2(`<!--]-->`);
              if (unref(filteredUsers).length === 0) {
                _push2(`<tr${_scopeId}><td colspan="4" class="px-5 py-10 text-center text-sm text-gray-400"${_scopeId}>Aucun utilisateur trouv\xE9.</td></tr>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</tbody></table>`);
            }
            _push2(`</div><div class="flex items-center justify-between text-sm text-gray-400"${_scopeId}><span${_scopeId}>Page ${ssrInterpolate(unref(page))} \xB7 ${ssrInterpolate(unref(filteredUsers).length)} r\xE9sultats</span><div class="flex gap-2"${_scopeId}><button${ssrIncludeBooleanAttr(unref(page) === 1) ? " disabled" : ""} class="px-4 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600"${_scopeId}>Pr\xE9c\xE9dent</button><button${ssrIncludeBooleanAttr(!unref(hasMore)) ? " disabled" : ""} class="px-4 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600"${_scopeId}>Suivant</button></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-5" }, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-xl font-bold text-gray-900" }, "Utilisateurs"),
                    createVNode("p", { class: "text-sm text-gray-400 mt-0.5" }, toDisplayString(unref(totalCount)) + " comptes enregistr\xE9s", 1)
                  ]),
                  createVNode("button", {
                    onClick: exportCsv,
                    class: "flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl px-4 py-2 hover:border-gray-300 transition"
                  }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-4 h-4",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      })
                    ])),
                    createTextVNode(" Exporter CSV ")
                  ])
                ]),
                createVNode("div", { class: "flex flex-wrap gap-3" }, [
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => isRef(search) ? search.value = $event : null,
                    type: "text",
                    placeholder: "Rechercher par nom ou email\u2026",
                    class: "flex-1 min-w-52 px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(search)]
                  ]),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => isRef(filterRegion) ? filterRegion.value = $event : null,
                    class: "px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  }, [
                    createVNode("option", { value: "" }, "Toutes les r\xE9gions"),
                    (openBlock(), createBlock(Fragment, null, renderList(regions, (r) => {
                      return createVNode("option", {
                        key: r,
                        value: r
                      }, toDisplayString(r), 9, ["value"]);
                    }), 64))
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, unref(filterRegion)]
                  ]),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => isRef(filterStatus) ? filterStatus.value = $event : null,
                    class: "px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  }, [
                    createVNode("option", { value: "" }, "Tous les statuts"),
                    createVNode("option", { value: "active" }, "Actif"),
                    createVNode("option", { value: "disabled" }, "D\xE9sactiv\xE9")
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, unref(filterStatus)]
                  ])
                ]),
                createVNode("div", { class: "bg-white rounded-2xl border border-gray-100 overflow-hidden" }, [
                  unref(loading) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "p-6 space-y-3"
                  }, [
                    (openBlock(), createBlock(Fragment, null, renderList(8, (i) => {
                      return createVNode("div", {
                        key: i,
                        class: "h-10 bg-gray-100 rounded-xl animate-pulse"
                      });
                    }), 64))
                  ])) : (openBlock(), createBlock("table", {
                    key: 1,
                    class: "w-full text-sm"
                  }, [
                    createVNode("thead", null, [
                      createVNode("tr", { class: "border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide" }, [
                        createVNode("th", { class: "text-left px-5 py-3 font-medium" }, "Utilisateur"),
                        createVNode("th", { class: "text-left px-5 py-3 font-medium hidden md:table-cell" }, "R\xE9gion"),
                        createVNode("th", { class: "text-left px-5 py-3 font-medium hidden lg:table-cell" }, "Inscription"),
                        createVNode("th", { class: "text-left px-5 py-3 font-medium" }, "Statut")
                      ])
                    ]),
                    createVNode("tbody", null, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(filteredUsers), (user) => {
                        return openBlock(), createBlock("tr", {
                          key: user.id,
                          class: "border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition"
                        }, [
                          createVNode("td", { class: "px-5 py-3.5" }, [
                            createVNode("div", { class: "flex items-center gap-3" }, [
                              createVNode("div", { class: "w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0" }, toDisplayString(initials(user.displayName)), 1),
                              createVNode("div", null, [
                                createVNode("p", { class: "font-medium text-gray-900" }, toDisplayString(user.displayName), 1),
                                createVNode("p", { class: "text-xs text-gray-400" }, toDisplayString(user.email), 1)
                              ])
                            ])
                          ]),
                          createVNode("td", { class: "px-5 py-3.5 text-gray-500 hidden md:table-cell" }, toDisplayString(user.region || "\u2014"), 1),
                          createVNode("td", { class: "px-5 py-3.5 text-gray-400 hidden lg:table-cell" }, toDisplayString(formatDate(user.createdAt)), 1),
                          createVNode("td", { class: "px-5 py-3.5" }, [
                            createVNode("span", {
                              class: [user.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500", "text-xs px-2.5 py-1 rounded-full font-medium"]
                            }, toDisplayString(user.status === "active" ? "Actif" : "D\xE9sactiv\xE9"), 3)
                          ])
                        ]);
                      }), 128)),
                      unref(filteredUsers).length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", {
                          colspan: "4",
                          class: "px-5 py-10 text-center text-sm text-gray-400"
                        }, "Aucun utilisateur trouv\xE9.")
                      ])) : createCommentVNode("", true)
                    ])
                  ]))
                ]),
                createVNode("div", { class: "flex items-center justify-between text-sm text-gray-400" }, [
                  createVNode("span", null, "Page " + toDisplayString(unref(page)) + " \xB7 " + toDisplayString(unref(filteredUsers).length) + " r\xE9sultats", 1),
                  createVNode("div", { class: "flex gap-2" }, [
                    createVNode("button", {
                      onClick: prevPage,
                      disabled: unref(page) === 1,
                      class: "px-4 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600"
                    }, "Pr\xE9c\xE9dent", 8, ["disabled"]),
                    createVNode("button", {
                      onClick: nextPage,
                      disabled: !unref(hasMore),
                      class: "px-4 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition text-gray-600"
                    }, "Suivant", 8, ["disabled"])
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/users/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-V--j80yl.mjs.map
