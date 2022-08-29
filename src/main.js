import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import categoriesModule from "./modules/categories";

import { registerModules } from "./register-modules";
import vuetify from "./plugins/vuetify";

registerModules({
  categories: categoriesModule
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
