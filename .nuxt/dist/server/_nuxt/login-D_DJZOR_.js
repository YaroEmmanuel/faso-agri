import { defineComponent, reactive, ref, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderDynamicModel, ssrInterpolate, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { u as useNuxtApp, a as useRouter } from "../server.mjs";
import { a as useSeoMeta } from "./v3-BR0C_1wp.js";
import "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/hookable/dist/index.mjs";
import "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/unctx/dist/index.mjs";
import "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/defu/dist/defu.mjs";
import "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/ufo/dist/index.mjs";
import "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/@unhead/vue/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const { $auth } = useNuxtApp();
    useRouter();
    const form = reactive({ email: "", password: "" });
    const showPassword = ref(false);
    const loading = ref(false);
    const error = ref("");
    useSeoMeta({ title: "Connexion — Admin Faso Agri" });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 flex items-center justify-center px-4" }, _attrs))}><div class="w-full max-w-sm"><div class="text-center mb-10"><div class="text-3xl font-semibold text-primary uppercase tracking-widest mb-1">Faso Agri</div><p class="text-xs text-gray-400 tracking-wide uppercase">Espace administration</p></div><div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"><h1 class="text-lg font-semibold text-gray-900 mb-6">Connexion</h1><form class="space-y-4"><div><label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide"> Adresse e-mail </label><input${ssrRenderAttr("value", unref(form).email)} type="email" placeholder="admin@fasoagri.bf" class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" required></div><div><label class="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide"> Mot de passe </label><div class="relative"><input${ssrRenderDynamicModel(unref(showPassword) ? "text" : "password", unref(form).password, null)}${ssrRenderAttr("type", unref(showPassword) ? "text" : "password")} placeholder="••••••••" class="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition pr-10" required><button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">`);
      if (!unref(showPassword)) {
        _push(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>`);
      } else {
        _push(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>`);
      }
      _push(`</button></div></div>`);
      if (unref(error)) {
        _push(`<div class="flex items-center gap-2 text-xs text-red-600 bg-red-50 rounded-xl px-4 py-3"><svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg> ${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2">`);
      if (!unref(loading)) {
        _push(`<span>Se connecter</span>`);
      } else {
        _push(`<span class="flex items-center justify-center gap-2"><svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> Connexion... </span>`);
      }
      _push(`</button></form></div><p class="text-center text-xs text-gray-400 mt-6">Faso Agri · Yaangré Tech</p></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=login-D_DJZOR_.js.map
