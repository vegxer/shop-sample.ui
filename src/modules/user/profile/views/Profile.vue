<template>
  <v-container class="mt-16" fluid fill-height>
    <v-layout flex align-center justify-center>
      <v-flex xs12 sm4 elevation-6>
        <v-card>
          <v-card-text class="pt-4">
            <div>
              <v-form>
                <v-text-field class="mt-3"
                    prepend-icon="mdi-account"
                    label="Логин"
                    :value="getLogin"
                    readonly
                    outlined
                ></v-text-field>
                <v-text-field
                    prepend-icon="mdi-email"
                    label="Email"
                    v-model="getEmail"
                    readonly
                    outlined
                    required
                ></v-text-field>
                <v-text-field
                    prepend-icon="mdi-key"
                    label="Роль"
                    v-model="role"
                    readonly
                    outlined
                    required
                ></v-text-field>
                <v-btn @click="tryLogout" style="margin-left: 25%" width="50%" class="blue darken-2 white--text">
                  Выйти
                </v-btn>
                <div v-if="errorMessage != null" class="mt-3" style="color: red; text-align: center">
                  {{ errorMessage }}
                </div>
              </v-form>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "login",
  data() {
    return {
      errorMessage: null
    };
  },
  created() {
    document.title = this.$route.meta.title;
  },
  computed: {
    ...mapGetters("user", ["getLogin", "getEmail"]),
    role() {
      return this.getRole() === 'ADMIN' ? 'Администратор' : 'Пользователь';
    }
  },
  methods: {
    ...mapActions("user", ["logout"]),
    ...mapGetters("user", ["getRole"]),
    tryLogout() {
      this.errorMessage = null;
      this.logout()
          .then(() => this.$router.push("/categories"))
          .catch(() => {
            this.errorMessage = "Упс! Что-то пошло не так...";
          });
    }
  }
}
</script>

<style scoped>

</style>