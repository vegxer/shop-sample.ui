<template>
  <div>
    <div v-if="isLoading">
      <v-row justify="center" no-gutters class="my-12">
        <v-progress-circular indeterminate color="primary" size="64"/>
      </v-row>
    </div>

    <div v-else-if="products.length">
      <navigation-menu :current-name="category" :categories-path="categoriesPath"/>
      <v-row>
        <v-col cols="4" v-for="product in products" :key="product.id">
          <v-card>
            <router-link v-if="product.imageThumbnailPaths == null || product.imageThumbnailPaths.length === 0"
                         :to="`/products/${product.id}`">
              <v-img height="300"
                     src="@/assets/no_photo.png"/>
            </router-link>
            <v-carousel v-else hide-delimiters height="300">
              <v-carousel-item v-bind:to="`/products/${product.id}`"
                               v-for="(image, i) in product.imageThumbnailPaths"
                               :key="i"
                               reverse-transition="fade-transition"
                               transition="fade-transition">
                <v-img height="300" :src="image == null ? '@/assets/no_photo.png' : fullPath(image)">
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
  </div>
</template>

<script>
import productService from "@/modules/products/api/service/products-service";
import fileService from "@/api/service/file-service";

export default {
  name: "Home",
  data: () => ({
    category: null,
    categoriesPath: null,
    products: [],
    isLoading: false
  }),
  async created() {
    this.isLoading = true;

    try {
      const response = (await productService.getCategoryProducts(this.$route.params.id, 1, 10, "id", "ASC")).data;
      if (response.body.name != null) {
        this.category = response.body.name;
        document.title = this.category;
      }
      this.categoriesPath = response.categoriesPath;
      this.products = response.body.items;
    } finally {
      this.isLoading = false;
    }
  },
  mounted() {
    document.title = this.$route.meta.title;
  },
  methods: {
    fullPath(name) {
      return fileService.buildFullAttachmentPath(name);
    }
  }
};
</script>
