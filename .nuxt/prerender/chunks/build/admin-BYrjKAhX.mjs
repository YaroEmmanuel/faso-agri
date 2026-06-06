import { executeAsync } from 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/unctx/dist/index.mjs';
import { g as defineNuxtRouteMiddleware, u as useNuxtApp, n as navigateTo } from './server.mjs';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/vue/index.mjs';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/ofetch/dist/node.mjs';
import '../_/nitro.mjs';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/h3/dist/index.mjs';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/ufo/dist/index.mjs';
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
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/vue-router/vue-router.node.mjs';
import 'file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/vue/server-renderer/index.mjs';

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
    const { getIdTokenResult } = ([__temp, __restore] = executeAsync(() => import('file://C:/Users/emmay/Documents/GitHub/extra/faso-agri-nuxt/node_modules/firebase/auth/dist/index.mjs')), __temp = await __temp, __restore(), __temp);
    const tokenResult = ([__temp, __restore] = executeAsync(() => getIdTokenResult(user)), __temp = await __temp, __restore(), __temp);
    const role = tokenResult.claims["role"];
    if (role !== "admin" && role !== "superadmin") {
      return navigateTo("/admin/login");
    }
  } catch {
    return navigateTo("/admin/login");
  }
});

export { admin as default };
//# sourceMappingURL=admin-BYrjKAhX.mjs.map
