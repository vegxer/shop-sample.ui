<template>
  <v-container class="mt-16" fluid fill-height>
    <v-layout flex align-center justify-center>
      <v-flex xs12 sm4 elevation-6>
        <v-card>
          <v-card-text class="pt-4">
            <div>
              <v-form>
                <v-text-field
                    class="mt-3"
                    prepend-icon="mdi-account"
                    label="Логин"
                    v-model="login"
                    outlined
                    :rules="usernameRules"
                ></v-text-field>
                <v-text-field
                    prepend-icon="mdi-email"
                    label="Email"
                    v-model="email"
                    :rules="emailRules"
                    outlined
                    required
                ></v-text-field>
                <v-select v-model="role" :items="roles" item-text="text" prepend-icon="mdi-key" outlined required
                          item-value="value" label="Роль">
                </v-select>
                <v-btn @click="setProfile" style="margin-left: 25%" width="50%" color="success">
                  Сохранить
                </v-btn>
                <v-btn @click="tryLogout" style="margin-left: 25%" width="50%" class="mt-5" color="error">
                  Выйти
                </v-btn>
                <v-snackbar color="red" :value="error != null">
                  {{ error }}
                  <template #action="{ attrs }">
                    <v-btn text v-bind="attrs" @click="error = null">
                      Закрыть
                    </v-btn>
                  </template>
                </v-snackbar>
                <v-snackbar v-model="profileSaved" timeout="4000" color="success">
                  Профиль успешно сохранён
                </v-snackbar>
                <confirm-dialog v-if="emailChanged" :registration="false"></confirm-dialog>
              </v-form>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import ConfirmDialog from "@/modules/user/registration/components/ConfirmDialog";

export default {
  name: "login",
  components: {
    'confirm-dialog': ConfirmDialog
  },
  data() {
    return {
      login: this.getLogin(),
      email: this.getEmail(),
      role: this.getRole(),
      error: null,
      profileSaved: false,
      emailChanged: false,
      roles: [
        {value: 'USER', text: 'Пользователь'},
        {value: 'ADMIN', text: 'Администратор'}
      ],
      usernameRules: [
        (v) => !!v || 'Необходим логин',
        (v) => v?.length > 2 || 'Длина логина должна быть не меньше трёх символов'
      ],
      emailRules: [
        (v) => !!v || 'Необходим email',
        (v) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Некорректный email'
      ],
    };
  },
  created() {
    document.title = this.$route.meta.title;
  },
  methods: {
    ...mapActions("user", ["logout", "updateProfile", "refreshToken"]),
    ...mapGetters("user", ["getLogin", "getEmail", "getRole"]),
    ...mapMutations("user", ["setUserData"]),
    setProfile() {
      const roleChanged = this.role !== this.getRole();
      this.updateProfile({
        login: this.login,
        email: this.email,
        role: this.role
      }).then(response => {
        this.profileSaved = true;
        if (roleChanged) {
          this.refreshToken();
        }
        this.emailChanged = response.data.emailChanged;
      }).catch(error => {
        console.log(error)
        if (error.response?.status === 429) {
          this.setError("Слишком много запросов. Подождите немного");
        } else if (error.response?.status === 401 || error.response?.status === 403) {
          this.setError("Ошибка авторизации. Попробуйте перезайти в аккаунт");
        } else {
          this.setError("Упс! Что-то пошло не так...");
        }
      })
    },
    tryLogout() {
      this.logout()
          .then(() => this.$router.push("/categories"))
          .catch(() => {
            this.setError("Упс! Что-то пошло не так...");
          });
    },
    setError(message) {
      if (this.error == null) {
        this.error = message;
        setTimeout(() => {
          this.error = null;
        }, 4000);
      }
    },
  }
}
</script>

<style scoped>

</style>