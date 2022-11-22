<template>
  <v-container class="mt-16" fluid fill-height>
    <v-layout flex align-center justify-center>
      <v-flex xs12 sm4 elevation-6>
        <v-toolbar class="blue darken-3">
          <v-toolbar-title style="margin-left: 33%" class="white--text"><h4>Авторизация</h4></v-toolbar-title>
        </v-toolbar>
        <v-card>
          <v-card-text class="pt-4">
            <div>
              <v-form v-model="valid" ref="form">
                <v-text-field
                    prepend-icon="mdi-account"
                    label="Логин"
                    v-model="username"
                    :rules="usernameRules"
                    required
                ></v-text-field>
                <v-text-field
                    prepend-icon="mdi-lock"
                    label="Пароль"
                    v-model="password"
                    min="8"
                    type="password"
                    :rules="passwordRules"
                    required
                ></v-text-field>
                <v-btn @click="submit" style="margin-left: 25%" width="50%" class="mt-5 blue darken-2 white--text">
                  Войти
                </v-btn>
                <div v-if="!valid" class="mt-3" style="color: red; text-align: center">
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
import {mapActions} from "vuex";

export default {
  name: "login",
  data() {
    return {
      valid: false,
      password: '',
      passwordRules: [
        (v) => !!v || 'Необходим пароль'
      ],
      username: '',
      usernameRules: [
        (v) => !!v || 'Необходим логин'
      ],
      errorMessage: null
    }
  },
  created() {
    document.title = this.$route.meta.title;
  },
  methods: {
    ...mapActions("user", ["login"]),
    submit() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.login({
        login: this.username,
        password: this.password
      }).then(() => this.$router.push("/profile"))
          .catch(error => {
            this.valid = false;
            if (error.isAxiosError) {
              if (error.response.status === 400) {
                this.errorMessage = "Неверный логин или пароль";
              } else if (error.response.status === 403) {
                this.errorMessage = "Подтвердите регистрацию в письме на email"
              } else if (error.response.status === 429) {
                this.errorMessage = "Слишком много попыток входа, попробуйте позже";
              } else {
                this.errorMessage = "Упс! Что-то пошло не так..."
              }
            }
          });
    },
    clear() {
      this.$refs.form.reset()
    }
  }
}
</script>

<style scoped>

</style>