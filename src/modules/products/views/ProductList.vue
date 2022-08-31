<template>
  <div>
    <h1 class="mb-3">Товары</h1>

    <v-row v-if="isLoading" justify="center" no-gutters class="my-12">
      <v-progress-circular indeterminate color="primary" size="64"/>
    </v-row>

    <v-row v-else-if="products.length">
      <v-col cols="4" v-for="product in products" :key="product.id">
        <v-card>
          <v-carousel hide-delimiters height="300">
            <v-carousel-item v-bind:to="`/products/${product.id}`"
                v-for="(image, i) in product.imageThumbnailPaths"
                :key="i"
                :src="fullPath(image)"
                reverse-transition="fade-transition"
                transition="fade-transition">
            </v-carousel-item>
          </v-carousel>
          <v-card-title class="pb-0">
            {{ product.name }}
          </v-card-title>
          <v-card-title class="green--text pt-0">
            {{ product.price }} ₽
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import productService from "@/modules/products/api/service/products-service";
import fileService from "@/api/service/file-service";

export default {
  name: "Home",
  data: () => ({
    products: [],
    isLoading: false
  }),
  async created() {
    this.isLoading = true;

    try {
      this.products = (await productService.getCategoryProducts(this.$route.params.id, 1, 10, "id", "ASC")).data.body;
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
