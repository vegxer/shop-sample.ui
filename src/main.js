import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import categoriesModule from "./modules/categories";
import productsModule from "./modules/products";

import { registerModules } from "./register-modules";
import vuetify from "./plugins/vuetify";
import NavigationMenu from "@/components/NavigationMenu";

registerModules({
  categories: categoriesModule,
  products: productsModule
});

Vue.config.productionTip = false;
Vue.component('navigation-menu', NavigationMenu);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
