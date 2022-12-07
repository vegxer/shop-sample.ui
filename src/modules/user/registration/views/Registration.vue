<template>
  <v-container class="mt-16" fluid fill-height>
    <v-layout flex align-center justify-center>
      <v-flex xs12 sm4 elevation-6>
        <v-toolbar class="blue darken-3">
          <v-toolbar-title class="white--text container"><h4 class="center">Регистрация</h4></v-toolbar-title>
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
                    prepend-icon="mdi-email"
                    label="Email"
                    v-model="email"
                    :rules="emailRules"
                    required
                ></v-text-field>
                <v-select v-model="role" :items="roles" item-text="text" prepend-icon="mdi-key" label="Роль"
                          item-value="value">
                </v-select>
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
                <v-btn @click="submit" block width="65%" type="submit"
                       class="mt-5 blue darken-2 white--text container">
                  Регистрация
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
    <confirm-dialog v-if="showDialog"></confirm-dialog>
  </v-container>
</template>

<script>
import {mapActions} from "vuex";
import ConfirmDialog from "@/modules/user/registration/components/ConfirmDialog";

export default {
  name: "login",
  components: {
    'confirm-dialog': ConfirmDialog
  },
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
      role: 'USER',
      roles: [
        {value: 'USER', text: 'Пользователь'},
        {value: 'ADMIN', text: 'Администратор'}
      ],
      errorMessage: null,
      showDialog: false
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
        password: this.password,
        role: this.role
      }).then(() => {
        this.showDialog = true;
      }).catch(error => {
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