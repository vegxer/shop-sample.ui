<template>
  <div>
    <div v-if="isLoading">
      <v-row justify="center" no-gutters class="my-12">
        <v-progress-circular indeterminate color="primary" size="64"/>
      </v-row>
    </div>

    <div v-else-if="products != null" class="mb-16">
      <navigation-menu :current-name="category" :categories-path="categoriesPath"/>
      <div v-if="isAdmin" class="mb-4">
        <div class="mb-2">
          <v-btn color="success" small @click="createCategory">
            <v-icon class="mr-1" small>mdi-plus</v-icon>
            Подкатегория
          </v-btn>
        </div>
        <div>
          <v-btn color="primary" small @click="createProduct">
            <v-icon class="mr-1" small>mdi-plus</v-icon>
            Товар
          </v-btn>
        </div>
      </div>
      <v-row>
        <v-col style="max-width: 440px;" v-for="product in products" :key="product.id" class="d-flex mb-5">
          <v-card width="350">
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
                          color="black"
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
          <v-menu v-if="isAdmin">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon
                     v-bind="attrs"
                     v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="deleteProduct(product.id)">
                <v-list-item-title>Удалить</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </div>
    <v-pagination
        class="pagination"
        :length="pagination.totalPages"
        :total-visible="10"
        v-model="pagination.currPage"
        @input="loadProducts"
    >
    </v-pagination>
    <v-snackbar color="red" :value="error != null">
      {{ error }}
      <template #action="{ attrs }">
        <v-btn text v-bind="attrs" @click="error = null">
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>
    <category-save v-if="editCategory.isEditing" @cancel="cancelCategoryEdit" @save="confirmCategoryEdit"
                   :image-path="editCategory.imagePath" :name="editCategory.name">
    </category-save>
  </div>
</template>

<script>
import productService from "@/modules/products/api/service/products-service";
import fileService from "@/api/service/file-service";
import CategoryAdd from "@/modules/categories/components/CategorySave";
import {mapGetters} from "vuex";
import categoryService from "@/modules/categories/api/service/category-service";

export default {
  name: "product-list",
  components: {
    'category-save': CategoryAdd
  },
  data: () => ({
    category: null,
    categoriesPath: null,
    products: [],
    isLoading: false,
    error: null,
    pagination: {
      currPage: 1,
      pageSize: 12,
      totalPages: 0
    },
    editCategory: {
      isEditing: false
    }
  }),
  computed: {
    ...mapGetters("user", ["isAdmin"])
  },
  created() {
    this.loadProducts();
  },
  mounted() {
    document.title = this.$route.meta.title;
  },
  methods: {
    createProduct() {
      this.$router.push(`/categories/${this.$route.params.id}/create`);
    },
    createCategory() {
      this.editCategory.isEditing = true;
    },
    async confirmCategoryEdit(data) {
      this.editCategory.isEditing = false;
      this.isLoading = true;
      let categoryId;
      try {
        categoryId = (await categoryService.createSubcategory({
          name: data.name,
          parentId: this.$route.params.id
        })).data;
      } catch (error) {
        this.setError("Не удалось сохранить категорию");
        this.isLoading = false;
        return;
      }
      if (data.updateImage) {
        try {
          await categoryService.setCategoryImage(categoryId, data.fileBlob);
        } catch (error) {
          this.setError("Не удалось сохранить картинку");
          this.isLoading = false;
          return;
        }
      } else if (data.deleteImage) {
        try {
          await categoryService.deleteImage(categoryId);
        } catch (error) {
          this.setError("Не удалось удалить картинку");
          this.isLoading = false;
          return;
        }
      }
      this.isLoading = false;
      this.$router.push(`/categories/${this.$route.params.id}`);
    },
    cancelCategoryEdit() {
      this.editCategory.isEditing = false;
    },
    async loadProducts() {
      this.isLoading = true;

      try {
        const response = (await productService.getCategoryProducts(this.$route.params.id, this.pagination.currPage, this.pagination.pageSize, "id", "ASC")).data;
        if (response.body.name != null) {
          this.category = response.body.name;
          document.title = this.category;
        }
        this.categoriesPath = response.categoriesPath;
        this.products = response.body.items.items;
        this.pagination.totalPages = response.body.items.totalPages;
      } catch (error) {
        this.setError("Не удалось загрузить товары");
      } finally {
        this.isLoading = false;
      }
    },
    async deleteProduct(id) {
      this.isLoading = true;
      try {
        await productService.deleteProduct(id);
        await this.loadProducts();
      } catch (error) {
        this.setError("Не удалось удалить товар");
      } finally {
        this.isLoading = false;
      }
    },
    setError(message) {
      if (this.error == null) {
        this.error = message;
        setTimeout(() => {
          this.error = null;
        }, 4000);
      }
    },
    fullPath(name) {
      return fileService.buildFullAttachmentPath(name);
    }
  }
};
</script>
<style scoped>
.pagination {
  position: absolute;
  bottom: -15px;
  margin: 0;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>
