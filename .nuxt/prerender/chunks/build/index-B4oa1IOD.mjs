import { _ as _sfc_main$1 } from './AdminLayout-Ah3JggTO.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-CkXNCsDJ.mjs';
import { defineComponent, ref, computed, withCtx, unref, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/vue/index.mjs';
import { ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr } from 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/vue/server-renderer/index.mjs';
import { updateDoc, doc, deleteDoc } from 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/firebase/firestore/dist/index.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { $firestore } = useNuxtApp();
    useSeoMeta({ title: "Forum \u2014 Admin Faso Agri" });
    const loading = ref(true);
    const topics = ref([]);
    const reportedItems = ref([]);
    const reportedCount = computed(() => reportedItems.value.length);
    const tabs = computed(() => [
      { key: "topics", label: "Sujets", badge: 0 },
      { key: "reported", label: "Signalements", badge: reportedCount.value }
    ]);
    const activeTab = ref("topics");
    function formatDate(ts) {
      if (!ts) return "\u2014";
      const d = ts.toDate ? ts.toDate() : new Date(ts);
      return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
    }
    async function togglePin(topic) {
      const newStatus = topic.status === "pinned" ? "open" : "pinned";
      await updateDoc(doc($firestore, "forumTopics", topic.id), { status: newStatus });
      topic.status = newStatus;
    }
    async function closeTopic(topic) {
      const newStatus = topic.status === "closed" ? "open" : "closed";
      await updateDoc(doc($firestore, "forumTopics", topic.id), { status: newStatus });
      topic.status = newStatus;
    }
    async function deleteTopic(id) {
      if (!confirm("Supprimer ce sujet d\xE9finitivement ?")) return;
      await deleteDoc(doc($firestore, "forumTopics", id));
      topics.value = topics.value.filter((t) => t.id !== id);
    }
    async function deleteReported(item) {
      if (!confirm("Supprimer ce contenu ?")) return;
      const col = item.type === "topic" ? "forumTopics" : "forumReplies";
      await deleteDoc(doc($firestore, col, item.id));
      reportedItems.value = reportedItems.value.filter((i) => i.id !== item.id);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AdminLayout = _sfc_main$1;
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(_component_AdminLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-5"${_scopeId}><div${_scopeId}><h1 class="text-xl font-semibold text-gray-900"${_scopeId}>Forum</h1><p class="text-sm text-gray-400 mt-0.5"${_scopeId}>Mod\xE9ration des discussions</p></div><div class="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit"${_scopeId}><!--[-->`);
            ssrRenderList(unref(tabs), (tab) => {
              _push2(`<button class="${ssrRenderClass([unref(activeTab) === tab.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600", "relative px-5 py-1.5 rounded-lg text-sm font-medium transition"])}"${_scopeId}>${ssrInterpolate(tab.label)} `);
              if (tab.badge > 0) {
                _push2(`<span class="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center"${_scopeId}>${ssrInterpolate(tab.badge)}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</button>`);
            });
            _push2(`<!--]--></div>`);
            if (unref(activeTab) === "topics") {
              _push2(`<div class="space-y-3"${_scopeId}>`);
              if (unref(loading)) {
                _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
                ssrRenderList(6, (i) => {
                  _push2(`<div class="h-16 bg-gray-100 rounded-xl animate-pulse"${_scopeId}></div>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--[-->`);
              ssrRenderList(unref(topics), (topic) => {
                _push2(`<div class="${ssrRenderClass([topic.reported ? "border-red-100 bg-red-50/30" : "border-gray-100 bg-white", "rounded-2xl border p-4 hover:shadow-sm transition"])}"${_scopeId}><div class="flex items-start justify-between gap-4"${_scopeId}><div class="flex-1 min-w-0"${_scopeId}><div class="flex items-center gap-2 flex-wrap mb-1"${_scopeId}>`);
                if (topic.status === "pinned") {
                  _push2(`<span class="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium"${_scopeId}>\u{1F4CC} \xC9pingl\xE9</span>`);
                } else {
                  _push2(`<!---->`);
                }
                if (topic.status === "closed") {
                  _push2(`<span class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium"${_scopeId}>\u{1F512} Ferm\xE9</span>`);
                } else {
                  _push2(`<!---->`);
                }
                if (topic.reported) {
                  _push2(`<span class="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium"${_scopeId}>\u26A0\uFE0F Signal\xE9</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
                _push2(ssrRenderComponent(_component_NuxtLink, {
                  to: `/admin/forum/${topic.id}`,
                  class: "font-medium text-gray-900 hover:text-primary transition line-clamp-1"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(topic.title)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(topic.title), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`<p class="text-xs text-gray-400 mt-0.5"${_scopeId}>${ssrInterpolate(topic.replyCount)} r\xE9ponse${ssrInterpolate(topic.replyCount !== 1 ? "s" : "")} \xB7 ${ssrInterpolate(formatDate(topic.createdAt))}</p></div><div class="flex items-center gap-1 flex-shrink-0"${_scopeId}><button${ssrRenderAttr("title", topic.status === "pinned" ? "D\xE9s\xE9pingler" : "\xC9pingler")} class="p-2 rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-gray-700"${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"${_scopeId}></path></svg></button><button${ssrRenderAttr("title", topic.status === "closed" ? "Rouvrir" : "Fermer")} class="p-2 rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-gray-700"${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"${_scopeId}></path></svg></button><button title="Supprimer" class="p-2 rounded-lg hover:bg-red-50 transition text-gray-400 hover:text-red-500"${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"${_scopeId}></path></svg></button></div></div></div>`);
              });
              _push2(`<!--]-->`);
              if (!unref(loading) && unref(topics).length === 0) {
                _push2(`<p class="text-center text-sm text-gray-400 py-10"${_scopeId}> Aucun sujet de forum. </p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(activeTab) === "reported") {
              _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
              ssrRenderList(unref(reportedItems), (item) => {
                _push2(`<div class="bg-white rounded-2xl border border-red-100 p-4"${_scopeId}><div class="flex items-start justify-between gap-4"${_scopeId}><div class="flex-1 min-w-0"${_scopeId}><p class="text-xs text-red-500 font-medium mb-1 uppercase tracking-wide"${_scopeId}>${ssrInterpolate(item.type === "topic" ? "Sujet" : "R\xE9ponse")}</p><p class="text-sm text-gray-800 line-clamp-2"${_scopeId}>${ssrInterpolate(item.content)}</p></div><button class="text-xs text-red-500 hover:text-red-700 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition flex-shrink-0"${_scopeId}> Supprimer </button></div></div>`);
              });
              _push2(`<!--]-->`);
              if (unref(reportedItems).length === 0) {
                _push2(`<p class="text-center text-sm text-gray-400 py-10"${_scopeId}> Aucun contenu signal\xE9. \u2713 </p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-5" }, [
                createVNode("div", null, [
                  createVNode("h1", { class: "text-xl font-semibold text-gray-900" }, "Forum"),
                  createVNode("p", { class: "text-sm text-gray-400 mt-0.5" }, "Mod\xE9ration des discussions")
                ]),
                createVNode("div", { class: "flex gap-1 bg-gray-100 rounded-xl p-1 w-fit" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(tabs), (tab) => {
                    return openBlock(), createBlock("button", {
                      key: tab.key,
                      onClick: ($event) => activeTab.value = tab.key,
                      class: [unref(activeTab) === tab.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600", "relative px-5 py-1.5 rounded-lg text-sm font-medium transition"]
                    }, [
                      createTextVNode(toDisplayString(tab.label) + " ", 1),
                      tab.badge > 0 ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center"
                      }, toDisplayString(tab.badge), 1)) : createCommentVNode("", true)
                    ], 10, ["onClick"]);
                  }), 128))
                ]),
                unref(activeTab) === "topics" ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "space-y-3"
                }, [
                  unref(loading) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "space-y-3"
                  }, [
                    (openBlock(), createBlock(Fragment, null, renderList(6, (i) => {
                      return createVNode("div", {
                        key: i,
                        class: "h-16 bg-gray-100 rounded-xl animate-pulse"
                      });
                    }), 64))
                  ])) : createCommentVNode("", true),
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(topics), (topic) => {
                    return openBlock(), createBlock("div", {
                      key: topic.id,
                      class: [topic.reported ? "border-red-100 bg-red-50/30" : "border-gray-100 bg-white", "rounded-2xl border p-4 hover:shadow-sm transition"]
                    }, [
                      createVNode("div", { class: "flex items-start justify-between gap-4" }, [
                        createVNode("div", { class: "flex-1 min-w-0" }, [
                          createVNode("div", { class: "flex items-center gap-2 flex-wrap mb-1" }, [
                            topic.status === "pinned" ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium"
                            }, "\u{1F4CC} \xC9pingl\xE9")) : createCommentVNode("", true),
                            topic.status === "closed" ? (openBlock(), createBlock("span", {
                              key: 1,
                              class: "text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium"
                            }, "\u{1F512} Ferm\xE9")) : createCommentVNode("", true),
                            topic.reported ? (openBlock(), createBlock("span", {
                              key: 2,
                              class: "text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium"
                            }, "\u26A0\uFE0F Signal\xE9")) : createCommentVNode("", true)
                          ]),
                          createVNode(_component_NuxtLink, {
                            to: `/admin/forum/${topic.id}`,
                            class: "font-medium text-gray-900 hover:text-primary transition line-clamp-1"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(topic.title), 1)
                            ]),
                            _: 2
                          }, 1032, ["to"]),
                          createVNode("p", { class: "text-xs text-gray-400 mt-0.5" }, toDisplayString(topic.replyCount) + " r\xE9ponse" + toDisplayString(topic.replyCount !== 1 ? "s" : "") + " \xB7 " + toDisplayString(formatDate(topic.createdAt)), 1)
                        ]),
                        createVNode("div", { class: "flex items-center gap-1 flex-shrink-0" }, [
                          createVNode("button", {
                            onClick: ($event) => togglePin(topic),
                            title: topic.status === "pinned" ? "D\xE9s\xE9pingler" : "\xC9pingler",
                            class: "p-2 rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-gray-700"
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
                                d: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                              })
                            ]))
                          ], 8, ["onClick", "title"]),
                          createVNode("button", {
                            onClick: ($event) => closeTopic(topic),
                            title: topic.status === "closed" ? "Rouvrir" : "Fermer",
                            class: "p-2 rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-gray-700"
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
                                d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              })
                            ]))
                          ], 8, ["onClick", "title"]),
                          createVNode("button", {
                            onClick: ($event) => deleteTopic(topic.id),
                            title: "Supprimer",
                            class: "p-2 rounded-lg hover:bg-red-50 transition text-gray-400 hover:text-red-500"
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
                                d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              })
                            ]))
                          ], 8, ["onClick"])
                        ])
                      ])
                    ], 2);
                  }), 128)),
                  !unref(loading) && unref(topics).length === 0 ? (openBlock(), createBlock("p", {
                    key: 1,
                    class: "text-center text-sm text-gray-400 py-10"
                  }, " Aucun sujet de forum. ")) : createCommentVNode("", true)
                ])) : createCommentVNode("", true),
                unref(activeTab) === "reported" ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "space-y-3"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(reportedItems), (item) => {
                    return openBlock(), createBlock("div", {
                      key: item.id,
                      class: "bg-white rounded-2xl border border-red-100 p-4"
                    }, [
                      createVNode("div", { class: "flex items-start justify-between gap-4" }, [
                        createVNode("div", { class: "flex-1 min-w-0" }, [
                          createVNode("p", { class: "text-xs text-red-500 font-medium mb-1 uppercase tracking-wide" }, toDisplayString(item.type === "topic" ? "Sujet" : "R\xE9ponse"), 1),
                          createVNode("p", { class: "text-sm text-gray-800 line-clamp-2" }, toDisplayString(item.content), 1)
                        ]),
                        createVNode("button", {
                          onClick: ($event) => deleteReported(item),
                          class: "text-xs text-red-500 hover:text-red-700 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition flex-shrink-0"
                        }, " Supprimer ", 8, ["onClick"])
                      ])
                    ]);
                  }), 128)),
                  unref(reportedItems).length === 0 ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "text-center text-sm text-gray-400 py-10"
                  }, " Aucun contenu signal\xE9. \u2713 ")) : createCommentVNode("", true)
                ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/mnt/user-data/outputs/faso-agri-admin/pages/admin/forum/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-B4oa1IOD.mjs.map
