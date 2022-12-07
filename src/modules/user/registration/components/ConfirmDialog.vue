<template>
  <div class="text-center">
    <v-dialog :value="isOpen" width="500">

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Вы успешно {{registration ? 'зарегистрировались' : 'сменили email'}}
        </v-card-title>

        <v-card-text class="mt-5">
          На ваш email отправлено письмо с подтверждением. Подтвердите адрес электронной почты{{registration ? ', после чего авторизуйтесь на сайте' : ''}}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              text
              @click="registration ? $router.push('/login') : close()">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "confirm-dialog",
  props: {
    registration: {
      required: false,
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isOpen: true
    };
  },
  methods: {
    close() {
      this.isOpen = false;
    }
  }
}
</script>