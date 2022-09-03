<template>
  <div>
    <div v-if="isLoading">
      <v-row justify="center" no-gutters class="my-12">
        <v-progress-circular indeterminate color="primary" size="64"/>
      </v-row>
    </div>

    <div v-else-if="subcategories.length">
      <navigation-menu :current-name="category" :categories-path="categoriesPath"/>
      <v-row>
        <v-col cols="4" v-for="category in subcategories" :key="category.id">
          <v-card @click="moveToSubPage(category)">
            <v-img height="300" :src="category.imageThumbnailPath == null ? '@/assets/no_photo.png' : fullPath(category.imageThumbnailPath)">
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
            <v-card-title>
              {{ category.name }}
            </v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import categoryService from "@/modules/categories/api/service/category-service";
import fileService from "@/api/service/file-service";

export default {
  name: "Home",
  data: () => ({
    category: null,
    subcategories: [],
    categoriesPath: null,
    isLoading: false
  }),
  watch: {
    $route(to, from) {
      if (to.path.includes("categories") && from.path.includes("categories")) {
        this.category = null;
        this.subcategories = [];
        this.categoriesPath = null;
        this.loadCategories();
      }
    }
  },
  created() {
    this.loadCategories();
    document.title = this.$route.meta.title;
  },
  methods: {
    fullPath(name) {
      return fileService.buildFullAttachmentPath(name);
    },
    moveToSubPage(currCategory) {
      if (currCategory.hasChildren) {
        this.$router.push(`/categories/${currCategory.id}`);
      } else {
        this.$router.push(`/categories/${currCategory.id}/items`);
      }
    },
    async loadCategories() {
      this.isLoading = true;

      try {
        if (this.$route.params.id == null) {
          this.subcategories = (await categoryService.getPrimal(1, 10)).data;
        } else {
          const response = (await categoryService.getSubcategories(this.$route.params.id, 1, 10)).data;
          if (response.body.name != null) {
            this.category =  response.body.name;
            document.title = this.category;
          }
          this.categoriesPath = response.categoriesPath;
          this.subcategories = response.body.items;
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
