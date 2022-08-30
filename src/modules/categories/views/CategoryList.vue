<template>
  <div>
    <h1 class="mb-3">Категории</h1>

    <v-row v-if="isLoading" justify="center" no-gutters class="my-12">
      <v-progress-circular indeterminate color="primary" size="64"/>
    </v-row>

    <v-row v-else-if="categories.length">
      <v-col cols="3" v-for="category in categories" :key="category.id">
        <v-card @click="moveToSubPage(category)">
          <v-img height="300" :src="fullPath(category.imageThumbnailPath)"/>
          <v-card-title>
            {{ category.name }}
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import categoryService from "@/modules/categories/api/service/category-service";
import fileService from "@/api/service/file-service";

export default {
  name: "Home",
  data: () => ({
    categories: [],
    isLoading: false
  }),
  watch: {
    $route (to, from) {
      if (to.path.includes("categories") && from.path.includes("categories")) {
        this.loadCategories();
      }
    }
  },
  created() {
    this.loadCategories();
  },
  methods: {
    fullPath(name) {
      return fileService.buildFullAttachmentPath(name);
    },
    moveToSubPage(currCategory) {
      if (currCategory.hasChildren) {
        this.$router.push(`/categories/${currCategory.id}`);
      } else {
        this.$router.push(`/categories/${currCategory.id}/products`);
      }
    },
    async loadCategories() {
      this.isLoading = true;

      try {
        this.categories = this.$route.params.id == null
            ? (await categoryService.getPrimal(1, 10)).data
            : (await categoryService.getSubcategories(this.$route.params.id, 1, 10)).data.body;
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
