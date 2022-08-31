<template>
  <div>
    <v-row v-if="isLoading" justify="center" no-gutters class="my-12">
      <v-progress-circular indeterminate color="primary" size="64"/>
    </v-row>

    <template v-else-if="product">
      <v-row class="mt-5">
        <v-col cols="6">
          <v-card elevation="5" outlined>
            <v-carousel hide-delimiter-background>
              <v-carousel-item
                  v-for="(image, i) in product.imagePaths"
                  :key="i"
                  :src="fullPath(image)"
                  reverse-transition="fade-transition"
                  transition="fade-transition">
              </v-carousel-item>
            </v-carousel>
          </v-card>
        </v-col>

        <v-col cols="6">
          <h1 class="mb-3">
            {{ product.name }}
          </h1>
          <div class="green--text pb-0 text-h4 mb-3">{{ product.price }} ₽</div>
          <div v-if="product.state === 'UNAVAILABLE'" class="red--text pb-0 text-h5 mb-3">Нет в наличии</div>
          <div class="text-h6">В наличии {{ product.amount }} штук</div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-textarea readonly :value="product.description" auto-grow rows="1" label="Описание"/>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script>
import productService from "@/modules/products/api/service/products-service";
import fileService from "@/api/service/file-service";

export default {
  name: "product",

  data: () => ({
    product: null,
    isLoading: false
  }),
  async created() {
    this.isLoading = true;

    try {
      this.product = (await productService.getProduct(this.$route.params.id)).data.body;
      console.log(this.product)
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
