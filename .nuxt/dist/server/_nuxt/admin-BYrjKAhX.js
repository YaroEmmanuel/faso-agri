import { executeAsync } from "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/unctx/dist/index.mjs";
import { g as defineNuxtRouteMiddleware, u as useNuxtApp, n as navigateTo } from "../server.mjs";
import "vue";
import "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/hookable/dist/index.mjs";
import "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/defu/dist/defu.mjs";
import "C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/ufo/dist/index.mjs";
import "vue/server-renderer";
const admin = defineNuxtRouteMiddleware(async (to) => {
  let __temp, __restore;
  if (to.path === "/admin/login") return;
  const { $auth } = useNuxtApp();
  if (!$auth) return;
  const user = $auth.currentUser;
  if (!user) {
    return navigateTo("/admin/login");
  }
  try {
    const { getIdTokenResult } = ([__temp, __restore] = executeAsync(() => import("firebase/auth")), __temp = await __temp, __restore(), __temp);
    const tokenResult = ([__temp, __restore] = executeAsync(() => getIdTokenResult(user)), __temp = await __temp, __restore(), __temp);
    const role = tokenResult.claims["role"];
    if (role !== "admin" && role !== "superadmin") {
      return navigateTo("/admin/login");
    }
  } catch {
    return navigateTo("/admin/login");
  }
});
export {
  admin as default
};
//# sourceMappingURL=admin-BYrjKAhX.js.map
