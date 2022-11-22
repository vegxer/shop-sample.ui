<template>
  <v-app>
    <v-app-bar app dense flat outlined>
      <v-tabs>
        <v-tab to="/categories">Каталог</v-tab>
        <v-tab class="right-align" v-if="isAuthorized" to="/profile">Профиль</v-tab>
        <v-tab class="right-align" v-if="!isAuthorized" to="/login">Вход</v-tab>
        <v-tab class="right-align" v-if="!isAuthorized" to="/registration">Регистрация</v-tab>
      </v-tabs>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import {mapGetters} from "vuex";

export default {
  computed: {
    ...mapGetters("user", ["isAuthorized"])
  }
}
</script>
