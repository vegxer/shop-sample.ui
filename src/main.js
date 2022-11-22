import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import categoriesModule from "./modules/categories";
import productsModule from "./modules/products";
import userModule from "./modules/user";
import loginModule from "./modules/user/login";
import profileModule from "./modules/user/profile";
import registrationModule from "./modules/user/registration";

import { registerModules } from "./register-modules";
import vuetify from "./plugins/vuetify";
import NavigationMenu from "@/components/NavigationMenu";

registerModules({
  categories: categoriesModule,
  products: productsModule,
  user: userModule,
  login: loginModule,
  profile: profileModule,
  registration: registrationModule
});

Vue.config.productionTip = false;
Vue.component('navigation-menu', NavigationMenu);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
