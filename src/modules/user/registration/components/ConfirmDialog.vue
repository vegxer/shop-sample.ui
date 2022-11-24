<template>
  <div class="text-center">
    <v-dialog :value="true" width="500">

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Вы успешно зарегистрировались
        </v-card-title>

        <v-card-text class="mt-5">
          На ваш email отправлено письмо с подтверждением. Подтвердите адрес электронной почты, после чего авторизуйтесь на сайте
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              text
              @click="$router.push('/login')">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "confirm-dialog"
}
</script>