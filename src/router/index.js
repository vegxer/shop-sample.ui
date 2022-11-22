import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: "/",
  routes: [
    {
      path: "/",
      redirect: "/categories"
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  if (store.getters["user/isAuthorized"] == null) {
    await store.dispatch("user/refreshToken")
        .catch(() => {});
  }
  return next();
});

export default router;
