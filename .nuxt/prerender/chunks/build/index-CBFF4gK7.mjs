import { _ as _sfc_main$1 } from './AdminLayout-Ah3JggTO.mjs';
import { defineComponent, ref, computed, reactive, withCtx, unref, createVNode, openBlock, createBlock, createTextVNode, withDirectives, isRef, vModelSelect, Fragment, renderList, createCommentVNode, toDisplayString, Teleport, withModifiers, vModelText, useSSRContext } from 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/vue/index.mjs';
import { ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderTeleport, ssrRenderAttr } from 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/vue/server-renderer/index.mjs';
import { updateDoc, doc, serverTimestamp, addDoc, collection } from 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/firebase/firestore/dist/index.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { $firestore } = useNuxtApp();
    useSeoMeta({ title: "Publications \u2014 Admin Faso Agri" });
    const regions = [
      "Centre",
      "Hauts-Bassins",
      "Cascades",
      "Est",
      "Nord",
      "Centre-Nord",
      "Centre-Ouest",
      "Centre-Est",
      "Boucle du Mouhoun",
      "Sahel",
      "Sud-Ouest",
      "Plateau-Central",
      "Centre-Sud"
    ];
    const pubs = ref([]);
    const loading = ref(true);
    const filterType = ref("");
    const filterStatus = ref("");
    const filteredPubs = computed(() => {
      return pubs.value.filter((p) => {
        const matchType = !filterType.value || p.type === filterType.value;
        const matchStatus = !filterStatus.value || p.status === filterStatus.value;
        return matchType && matchStatus;
      });
    });
    const editorOpen = ref(false);
    const editingId = ref(null);
    const saving = ref(false);
    const defaultForm = () => ({
      title: "",
      body: "",
      type: "news",
      targetRegion: "all",
      sendNotification: false
    });
    const form = reactive(defaultForm());
    function openEditor(pub) {
      var _a;
      editingId.value = (_a = pub == null ? void 0 : pub.id) != null ? _a : null;
      Object.assign(form, pub ? {
        title: pub.title,
        body: pub.body,
        type: pub.type,
        targetRegion: pub.targetRegion,
        sendNotification: pub.sendNotification
      } : defaultForm());
      editorOpen.value = true;
    }
    async function save(status) {
      if (!form.title) return;
      saving.value = true;
      try {
        const payload = {
          ...form,
          status,
          ...status === "published" ? { publishedAt: serverTimestamp() } : {}
        };
        if (editingId.value) {
          await updateDoc(doc($firestore, "publications", editingId.value), payload);
          pubs.value = pubs.value.map((p) => p.id === editingId.value ? { ...p, ...payload } : p);
        } else {
          const ref2 = await addDoc(collection($firestore, "publications"), {
            ...payload,
            createdAt: serverTimestamp(),
            createdBy: "admin"
          });
          pubs.value = [{ id: ref2.id, ...payload, createdAt: /* @__PURE__ */ new Date() }, ...pubs.value];
        }
        editorOpen.value = false;
      } finally {
        saving.value = false;
      }
    }
    async function archivePub(pub) {
      if (!confirm("Archiver cette publication ?")) return;
      await updateDoc(doc($firestore, "publications", pub.id), { status: "archived" });
      pub.status = "archived";
    }
    function formatDate(ts) {
      if (!ts) return "\u2014";
      const d = ts.toDate ? ts.toDate() : new Date(ts);
      return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
    }
    function typeBadge(t) {
      var _a;
      const m = {
        news: "bg-blue-50 text-blue-600",
        advice: "bg-yellow-50 text-yellow-700",
        alert: "bg-red-50 text-red-600",
        announcement: "bg-green-50 text-green-700"
      };
      return (_a = m[t]) != null ? _a : "bg-gray-100 text-gray-500";
    }
    function typeLabel(t) {
      var _a;
      const m = {
        news: "Actualit\xE9",
        advice: "Conseil",
        alert: "Alerte",
        announcement: "Annonce"
      };
      return (_a = m[t]) != null ? _a : t;
    }
    function statusBadge(s) {
      var _a;
      const m = {
        published: "bg-green-50 text-green-700",
        draft: "bg-gray-100 text-gray-500",
        archived: "bg-gray-100 text-gray-400"
      };
      return (_a = m[s]) != null ? _a : "bg-gray-100 text-gray-400";
    }
    function statusLabel(s) {
      var _a;
      const m = { published: "Publi\xE9", draft: "Brouillon", archived: "Archiv\xE9" };
      return (_a = m[s]) != null ? _a : s;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AdminLayout = _sfc_main$1;
      _push(ssrRenderComponent(_component_AdminLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-5"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><h1 class="text-xl font-semibold text-gray-900"${_scopeId}>Publications</h1><p class="text-sm text-gray-400 mt-0.5"${_scopeId}>Contenus \xE9ditoriaux et notifications</p></div><button class="inline-flex items-center gap-2 bg-primary text-white text-sm px-4 py-2 rounded-xl hover:opacity-90 transition"${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"${_scopeId}></path></svg> Nouvelle publication </button></div><div class="flex flex-wrap gap-3"${_scopeId}><select class="px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterType)) ? ssrLooseContain(unref(filterType), "") : ssrLooseEqual(unref(filterType), "")) ? " selected" : ""}${_scopeId}>Tous les types</option><option value="news"${ssrIncludeBooleanAttr(Array.isArray(unref(filterType)) ? ssrLooseContain(unref(filterType), "news") : ssrLooseEqual(unref(filterType), "news")) ? " selected" : ""}${_scopeId}>Actualit\xE9</option><option value="advice"${ssrIncludeBooleanAttr(Array.isArray(unref(filterType)) ? ssrLooseContain(unref(filterType), "advice") : ssrLooseEqual(unref(filterType), "advice")) ? " selected" : ""}${_scopeId}>Conseil agricole</option><option value="alert"${ssrIncludeBooleanAttr(Array.isArray(unref(filterType)) ? ssrLooseContain(unref(filterType), "alert") : ssrLooseEqual(unref(filterType), "alert")) ? " selected" : ""}${_scopeId}>Alerte</option><option value="announcement"${ssrIncludeBooleanAttr(Array.isArray(unref(filterType)) ? ssrLooseContain(unref(filterType), "announcement") : ssrLooseEqual(unref(filterType), "announcement")) ? " selected" : ""}${_scopeId}>Annonce</option></select><select class="px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "") : ssrLooseEqual(unref(filterStatus), "")) ? " selected" : ""}${_scopeId}>Tous les statuts</option><option value="draft"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "draft") : ssrLooseEqual(unref(filterStatus), "draft")) ? " selected" : ""}${_scopeId}>Brouillon</option><option value="published"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "published") : ssrLooseEqual(unref(filterStatus), "published")) ? " selected" : ""}${_scopeId}>Publi\xE9</option><option value="archived"${ssrIncludeBooleanAttr(Array.isArray(unref(filterStatus)) ? ssrLooseContain(unref(filterStatus), "archived") : ssrLooseEqual(unref(filterStatus), "archived")) ? " selected" : ""}${_scopeId}>Archiv\xE9</option></select></div><div class="space-y-3"${_scopeId}>`);
            if (unref(loading)) {
              _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
              ssrRenderList(5, (i) => {
                _push2(`<div class="h-20 bg-gray-100 rounded-2xl animate-pulse"${_scopeId}></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<!--[-->`);
            ssrRenderList(unref(filteredPubs), (pub) => {
              _push2(`<div class="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition"${_scopeId}><div class="flex items-start justify-between gap-4"${_scopeId}><div class="flex-1 min-w-0"${_scopeId}><div class="flex items-center gap-2 mb-1.5 flex-wrap"${_scopeId}><span class="${ssrRenderClass([typeBadge(pub.type), "text-xs px-2.5 py-0.5 rounded-full font-medium"])}"${_scopeId}>${ssrInterpolate(typeLabel(pub.type))}</span><span class="${ssrRenderClass([statusBadge(pub.status), "text-xs px-2.5 py-0.5 rounded-full font-medium"])}"${_scopeId}>${ssrInterpolate(statusLabel(pub.status))}</span>`);
              if (pub.sendNotification) {
                _push2(`<span class="text-xs text-gray-400"${_scopeId}>\u{1F514} Notif. FCM</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><p class="font-medium text-gray-900 line-clamp-1"${_scopeId}>${ssrInterpolate(pub.title)}</p><p class="text-xs text-gray-400 mt-0.5"${_scopeId}>${ssrInterpolate(pub.targetRegion === "all" ? "Diffusion nationale" : pub.targetRegion)} \xB7 ${ssrInterpolate(formatDate(pub.createdAt))}</p></div><div class="flex items-center gap-1 flex-shrink-0"${_scopeId}><button class="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition" title="Modifier"${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"${_scopeId}></path></svg></button><button class="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition" title="Archiver"${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"${_scopeId}></path></svg></button></div></div></div>`);
            });
            _push2(`<!--]-->`);
            if (!unref(loading) && unref(filteredPubs).length === 0) {
              _push2(`<p class="text-center text-sm text-gray-400 py-10"${_scopeId}> Aucune publication trouv\xE9e. </p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
            ssrRenderTeleport(_push2, (_push3) => {
              if (unref(editorOpen)) {
                _push3(`<div class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"${_scopeId}><div class="bg-white rounded-2xl w-full max-w-xl shadow-2xl max-h-[90vh] flex flex-col"${_scopeId}><div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0"${_scopeId}><h2 class="font-semibold text-gray-900 text-sm"${_scopeId}>${ssrInterpolate(unref(editingId) ? "Modifier la publication" : "Nouvelle publication")}</h2><button class="text-gray-400 hover:text-gray-600 transition"${_scopeId}><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"${_scopeId}></path></svg></button></div><div class="overflow-y-auto flex-1 px-6 py-5 space-y-4"${_scopeId}><div${_scopeId}><label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide"${_scopeId}>Titre</label><input${ssrRenderAttr("value", unref(form).title)} type="text" placeholder="Titre de la publication" class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"${_scopeId}></div><div class="grid grid-cols-2 gap-3"${_scopeId}><div${_scopeId}><label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide"${_scopeId}>Type</label><select class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"${_scopeId}><option value="news"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "news") : ssrLooseEqual(unref(form).type, "news")) ? " selected" : ""}${_scopeId}>Actualit\xE9</option><option value="advice"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "advice") : ssrLooseEqual(unref(form).type, "advice")) ? " selected" : ""}${_scopeId}>Conseil agricole</option><option value="alert"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "alert") : ssrLooseEqual(unref(form).type, "alert")) ? " selected" : ""}${_scopeId}>Alerte</option><option value="announcement"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "announcement") : ssrLooseEqual(unref(form).type, "announcement")) ? " selected" : ""}${_scopeId}>Annonce</option></select></div><div${_scopeId}><label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide"${_scopeId}>R\xE9gion cible</label><select class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"${_scopeId}><option value="all"${ssrIncludeBooleanAttr(Array.isArray(unref(form).targetRegion) ? ssrLooseContain(unref(form).targetRegion, "all") : ssrLooseEqual(unref(form).targetRegion, "all")) ? " selected" : ""}${_scopeId}>Nationale</option><!--[-->`);
                ssrRenderList(regions, (r) => {
                  _push3(`<option${ssrRenderAttr("value", r)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).targetRegion) ? ssrLooseContain(unref(form).targetRegion, r) : ssrLooseEqual(unref(form).targetRegion, r)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(r)}</option>`);
                });
                _push3(`<!--]--></select></div></div><div${_scopeId}><label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide"${_scopeId}>Contenu</label><textarea rows="5" placeholder="Contenu de la publication\u2026" class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"${_scopeId}>${ssrInterpolate(unref(form).body)}</textarea></div><div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"${_scopeId}><label class="flex items-center gap-2 cursor-pointer flex-1"${_scopeId}><div class="${ssrRenderClass([unref(form).sendNotification ? "bg-primary" : "bg-gray-200", "relative w-9 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0"])}"${_scopeId}><span class="${ssrRenderClass([unref(form).sendNotification ? "translate-x-4" : "translate-x-0.5", "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"])}"${_scopeId}></span></div><span class="text-sm text-gray-600"${_scopeId}>Envoyer une notification push FCM</span></label></div></div><div class="px-6 py-4 border-t border-gray-100 flex items-center gap-3 flex-shrink-0"${_scopeId}><button${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} class="px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition disabled:opacity-50"${_scopeId}> Enregistrer brouillon </button><button${ssrIncludeBooleanAttr(unref(saving) || !unref(form).title) ? " disabled" : ""} class="flex-1 px-4 py-2 text-sm bg-primary text-white rounded-xl hover:opacity-90 transition disabled:opacity-50"${_scopeId}>`);
                if (!unref(saving)) {
                  _push3(`<span${_scopeId}>Publier</span>`);
                } else {
                  _push3(`<span class="flex items-center justify-center gap-2"${_scopeId}><svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"${_scopeId}></path></svg> Publication\u2026 </span>`);
                }
                _push3(`</button></div></div></div>`);
              } else {
                _push3(`<!---->`);
              }
            }, "body", false, _parent2);
          } else {
            return [
              createVNode("div", { class: "space-y-5" }, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-xl font-semibold text-gray-900" }, "Publications"),
                    createVNode("p", { class: "text-sm text-gray-400 mt-0.5" }, "Contenus \xE9ditoriaux et notifications")
                  ]),
                  createVNode("button", {
                    onClick: ($event) => openEditor(),
                    class: "inline-flex items-center gap-2 bg-primary text-white text-sm px-4 py-2 rounded-xl hover:opacity-90 transition"
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
                        d: "M12 4v16m8-8H4"
                      })
                    ])),
                    createTextVNode(" Nouvelle publication ")
                  ], 8, ["onClick"])
                ]),
                createVNode("div", { class: "flex flex-wrap gap-3" }, [
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => isRef(filterType) ? filterType.value = $event : null,
                    class: "px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  }, [
                    createVNode("option", { value: "" }, "Tous les types"),
                    createVNode("option", { value: "news" }, "Actualit\xE9"),
                    createVNode("option", { value: "advice" }, "Conseil agricole"),
                    createVNode("option", { value: "alert" }, "Alerte"),
                    createVNode("option", { value: "announcement" }, "Annonce")
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, unref(filterType)]
                  ]),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => isRef(filterStatus) ? filterStatus.value = $event : null,
                    class: "px-4 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  }, [
                    createVNode("option", { value: "" }, "Tous les statuts"),
                    createVNode("option", { value: "draft" }, "Brouillon"),
                    createVNode("option", { value: "published" }, "Publi\xE9"),
                    createVNode("option", { value: "archived" }, "Archiv\xE9")
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, unref(filterStatus)]
                  ])
                ]),
                createVNode("div", { class: "space-y-3" }, [
                  unref(loading) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "space-y-3"
                  }, [
                    (openBlock(), createBlock(Fragment, null, renderList(5, (i) => {
                      return createVNode("div", {
                        key: i,
                        class: "h-20 bg-gray-100 rounded-2xl animate-pulse"
                      });
                    }), 64))
                  ])) : createCommentVNode("", true),
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(filteredPubs), (pub) => {
                    return openBlock(), createBlock("div", {
                      key: pub.id,
                      class: "bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition"
                    }, [
                      createVNode("div", { class: "flex items-start justify-between gap-4" }, [
                        createVNode("div", { class: "flex-1 min-w-0" }, [
                          createVNode("div", { class: "flex items-center gap-2 mb-1.5 flex-wrap" }, [
                            createVNode("span", {
                              class: [typeBadge(pub.type), "text-xs px-2.5 py-0.5 rounded-full font-medium"]
                            }, toDisplayString(typeLabel(pub.type)), 3),
                            createVNode("span", {
                              class: [statusBadge(pub.status), "text-xs px-2.5 py-0.5 rounded-full font-medium"]
                            }, toDisplayString(statusLabel(pub.status)), 3),
                            pub.sendNotification ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "text-xs text-gray-400"
                            }, "\u{1F514} Notif. FCM")) : createCommentVNode("", true)
                          ]),
                          createVNode("p", { class: "font-medium text-gray-900 line-clamp-1" }, toDisplayString(pub.title), 1),
                          createVNode("p", { class: "text-xs text-gray-400 mt-0.5" }, toDisplayString(pub.targetRegion === "all" ? "Diffusion nationale" : pub.targetRegion) + " \xB7 " + toDisplayString(formatDate(pub.createdAt)), 1)
                        ]),
                        createVNode("div", { class: "flex items-center gap-1 flex-shrink-0" }, [
                          createVNode("button", {
                            onClick: ($event) => openEditor(pub),
                            class: "p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition",
                            title: "Modifier"
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
                                d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              })
                            ]))
                          ], 8, ["onClick"]),
                          createVNode("button", {
                            onClick: ($event) => archivePub(pub),
                            class: "p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition",
                            title: "Archiver"
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
                                d: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                              })
                            ]))
                          ], 8, ["onClick"])
                        ])
                      ])
                    ]);
                  }), 128)),
                  !unref(loading) && unref(filteredPubs).length === 0 ? (openBlock(), createBlock("p", {
                    key: 1,
                    class: "text-center text-sm text-gray-400 py-10"
                  }, " Aucune publication trouv\xE9e. ")) : createCommentVNode("", true)
                ])
              ]),
              (openBlock(), createBlock(Teleport, { to: "body" }, [
                unref(editorOpen) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4",
                  onClick: withModifiers(($event) => editorOpen.value = false, ["self"])
                }, [
                  createVNode("div", { class: "bg-white rounded-2xl w-full max-w-xl shadow-2xl max-h-[90vh] flex flex-col" }, [
                    createVNode("div", { class: "flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0" }, [
                      createVNode("h2", { class: "font-semibold text-gray-900 text-sm" }, toDisplayString(unref(editingId) ? "Modifier la publication" : "Nouvelle publication"), 1),
                      createVNode("button", {
                        onClick: ($event) => editorOpen.value = false,
                        class: "text-gray-400 hover:text-gray-600 transition"
                      }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-5 h-5",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M6 18L18 6M6 6l12 12"
                          })
                        ]))
                      ], 8, ["onClick"])
                    ]),
                    createVNode("div", { class: "overflow-y-auto flex-1 px-6 py-5 space-y-4" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide" }, "Titre"),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).title = $event,
                          type: "text",
                          placeholder: "Titre de la publication",
                          class: "w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).title]
                        ])
                      ]),
                      createVNode("div", { class: "grid grid-cols-2 gap-3" }, [
                        createVNode("div", null, [
                          createVNode("label", { class: "block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide" }, "Type"),
                          withDirectives(createVNode("select", {
                            "onUpdate:modelValue": ($event) => unref(form).type = $event,
                            class: "w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                          }, [
                            createVNode("option", { value: "news" }, "Actualit\xE9"),
                            createVNode("option", { value: "advice" }, "Conseil agricole"),
                            createVNode("option", { value: "alert" }, "Alerte"),
                            createVNode("option", { value: "announcement" }, "Annonce")
                          ], 8, ["onUpdate:modelValue"]), [
                            [vModelSelect, unref(form).type]
                          ])
                        ]),
                        createVNode("div", null, [
                          createVNode("label", { class: "block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide" }, "R\xE9gion cible"),
                          withDirectives(createVNode("select", {
                            "onUpdate:modelValue": ($event) => unref(form).targetRegion = $event,
                            class: "w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                          }, [
                            createVNode("option", { value: "all" }, "Nationale"),
                            (openBlock(), createBlock(Fragment, null, renderList(regions, (r) => {
                              return createVNode("option", {
                                key: r,
                                value: r
                              }, toDisplayString(r), 9, ["value"]);
                            }), 64))
                          ], 8, ["onUpdate:modelValue"]), [
                            [vModelSelect, unref(form).targetRegion]
                          ])
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide" }, "Contenu"),
                        withDirectives(createVNode("textarea", {
                          "onUpdate:modelValue": ($event) => unref(form).body = $event,
                          rows: "5",
                          placeholder: "Contenu de la publication\u2026",
                          class: "w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).body]
                        ])
                      ]),
                      createVNode("div", { class: "flex items-center gap-3 p-3 bg-gray-50 rounded-xl" }, [
                        createVNode("label", { class: "flex items-center gap-2 cursor-pointer flex-1" }, [
                          createVNode("div", {
                            onClick: ($event) => unref(form).sendNotification = !unref(form).sendNotification,
                            class: [unref(form).sendNotification ? "bg-primary" : "bg-gray-200", "relative w-9 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0"]
                          }, [
                            createVNode("span", {
                              class: [unref(form).sendNotification ? "translate-x-4" : "translate-x-0.5", "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"]
                            }, null, 2)
                          ], 10, ["onClick"]),
                          createVNode("span", { class: "text-sm text-gray-600" }, "Envoyer une notification push FCM")
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "px-6 py-4 border-t border-gray-100 flex items-center gap-3 flex-shrink-0" }, [
                      createVNode("button", {
                        onClick: ($event) => save("draft"),
                        disabled: unref(saving),
                        class: "px-4 py-2 text-sm border border-gray-200 rounded-xl text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition disabled:opacity-50"
                      }, " Enregistrer brouillon ", 8, ["onClick", "disabled"]),
                      createVNode("button", {
                        onClick: ($event) => save("published"),
                        disabled: unref(saving) || !unref(form).title,
                        class: "flex-1 px-4 py-2 text-sm bg-primary text-white rounded-xl hover:opacity-90 transition disabled:opacity-50"
                      }, [
                        !unref(saving) ? (openBlock(), createBlock("span", { key: 0 }, "Publier")) : (openBlock(), createBlock("span", {
                          key: 1,
                          class: "flex items-center justify-center gap-2"
                        }, [
                          (openBlock(), createBlock("svg", {
                            class: "w-4 h-4 animate-spin",
                            fill: "none",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("circle", {
                              class: "opacity-25",
                              cx: "12",
                              cy: "12",
                              r: "10",
                              stroke: "currentColor",
                              "stroke-width": "4"
                            }),
                            createVNode("path", {
                              class: "opacity-75",
                              fill: "currentColor",
                              d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            })
                          ])),
                          createTextVNode(" Publication\u2026 ")
                        ]))
                      ], 8, ["onClick", "disabled"])
                    ])
                  ])
                ], 8, ["onClick"])) : createCommentVNode("", true)
              ]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/mnt/user-data/outputs/faso-agri-admin/pages/admin/publications/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CBFF4gK7.mjs.map
