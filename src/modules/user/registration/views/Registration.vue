<template>
  <v-container class="mt-16" fluid fill-height>
    <v-layout flex align-center justify-center>
      <v-flex xs12 sm4 elevation-6>
        <v-toolbar class="blue darken-3">
          <v-toolbar-title style="margin-left: 33%" class="white--text"><h4>Регистрация</h4></v-toolbar-title>
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
                    prepend-icon="mdi-account"
                    label="Email"
                    v-model="email"
                    :rules="emailRules"
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
                <v-text-field
                    prepend-icon="mdi-lock"
                    label="Повторите пароль"
                    v-model="repeatPassword"
                    min="8"
                    type="password"
                    :rules="repeatPasswordRules"
                    required
                ></v-text-field>
                <v-btn @click="submit" style="margin-left: 18%" width="65%" class="mt-5 blue darken-2 white--text">
                  Зарегистрироваться
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
        (v) => !!v || 'Необходим пароль',
        (v) => /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\w{8,}$/.test(v) || 'Пароль должен быть не менее 8 символов длиной и содержать хотя бы одну маленькую, большую буквы и цифру'
      ],
      repeatPassword: '',
      repeatPasswordRules: [
        (v) => !!v || 'Повторите пароль',
        (v) => v === this.password || 'Пароли не совпадают'
      ],
      email: '',
      emailRules: [
        (v) => !!v || 'Необходим email',
        (v) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Некорректный email'
      ],
      username: '',
      usernameRules: [
        (v) => !!v || 'Необходим логин',
        (v) => v?.length > 2 || 'Длина логина должна быть не меньше трёх символов'
      ],
      errorMessage: null
    }
  },
  created() {
    document.title = this.$route.meta.title;
  },
  methods: {
    ...mapActions("user", ["register"]),
    submit() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.register({
        login: this.username,
        email: this.email,
        password: this.password
      }).then(() => this.$router.push("/login"))
          .catch(error => {
            this.valid = false;
            if (error.isAxiosError) {
              if (error.response.status === 409) {
                this.errorMessage = error.response.data.message;
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