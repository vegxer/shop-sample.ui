<template>
  <v-container class="mt-16" fluid fill-height>
    <v-layout flex align-center justify-center>
      <v-flex xs12 sm4 elevation-6>
        <v-toolbar class="blue darken-3">
          <v-toolbar-title class="white--text container"><h4 class="center">Авторизация</h4></v-toolbar-title>
        </v-toolbar>
        <v-card>
          <v-card-text class="pt-4">
            <div>
              <v-form @submit.prevent v-model="valid" ref="form">
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
                <v-btn @click="submit" type="submit" block class="mt-5 blue darken-2 white--text">
                  Войти
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
      this.errorMessage = null;
      this.login({
        login: this.username,
        password: this.password
      }).then(() => this.$router.push("/profile"))
          .catch(error => {
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
.container {
  position: relative;
}

.center {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>