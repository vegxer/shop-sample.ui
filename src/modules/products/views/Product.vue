<template>
  <div>
    <div v-if="isLoading">
    <v-row justify="center" no-gutters class="my-12">
      <v-progress-circular indeterminate color="primary" size="64"/>
    </v-row>
    </div>

    <div v-else-if="product">
      <navigation-menu :current-name="product.name" :categories-path="categoriesPath"/>
      <v-row class="mt-5">
        <v-col cols="6">
          <v-card elevation="5" outlined>
            <v-img v-if="product.imagePaths == null || product.imagePaths.length === 0"
                   height="400"
                   src="@/assets/no_photo.png"/>
            <v-carousel v-else hide-delimiter-background>
              <v-carousel-item
                  v-for="(image, i) in product.imagePaths"
                  :key="i"
                  reverse-transition="fade-transition"
                  transition="fade-transition">
                <v-img height="600" :src="fullPath(image)">
                  <template v-slot:placeholder>
                    <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center">
                      <v-progress-circular
                          indeterminate
                          color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-carousel-item>
            </v-carousel>
          </v-card>
        </v-col>

        <v-col cols="6">
          <h1 class="mb-3">
            {{ product.name }}
          </h1>
          <div class="green--text pb-0 text-h4 mb-3">{{ product.price }} ₽</div>
          <div v-if="product.state === 'UNAVAILABLE' || product.amount === 0" class="red--text pb-0 text-h6 mb-3">Нет в наличии</div>
          <div v-else class="text-h6">В наличии {{ product.amount }} штук</div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-textarea readonly :value="product.description" auto-grow rows="1" label="Описание"/>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import productService from "@/modules/products/api/service/products-service";
import fileService from "@/api/service/file-service";

export default {
  name: "product",

  data: () => ({
    product: null,
    isLoading: false,
    categoriesPath: null
  }),
  async created() {
    this.isLoading = true;

    try {
      const response = (await productService.getProduct(this.$route.params.id)).data;
      this.categoriesPath = response.categoriesPath;
      this.product = response.body;
      document.title = this.product.name;
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    fullPath(name) {
      return fileService.buildFullAttachmentPath(name);
    }
  }
};
</script>
