<template>
  <div>
    <div v-if="isLoading">
      <v-row justify="center" no-gutters class="my-12">
        <v-progress-circular indeterminate color="primary" size="64"/>
      </v-row>
    </div>

    <div v-else-if="subcategories != null" class="mb-16">
      <navigation-menu :current-name="category" :categories-path="categoriesPath"/>
      <v-btn v-if="isAdmin" class="mb-4" color="success" small @click="createCategory()">
        <v-icon class="mr-1" small>mdi-plus</v-icon>
        Подкатегория
      </v-btn>
      <v-row>
        <v-col style="max-width: 440px;" v-for="category in subcategories" :key="category.id" class="d-flex mb-5">
          <v-card width="350" @click="moveToSubPage(category)">
            <v-img height="300"
                   :src="category.imageThumbnailPath == null ? require('@/assets/no_photo.png') : fullPath(category.imageThumbnailPath)">
              <template #placeholder>
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
            <v-card-title>
              {{ category.name }}
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
              <v-list-item @click="updateCategory(category.name, category.imageThumbnailPath, category.id)">
                <v-list-item-title>Редактировать</v-list-item-title>
              </v-list-item>
              <v-list-item @click="deleteCategory(category.id)">
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
        @input="loadCategories"
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
    <category-save v-if="editCategory.isEditing" @cancel="cancelEdit" @save="confirmEdit"
                   :image-path="editCategory.imagePath" :name="editCategory.name">
    </category-save>
  </div>
</template>

<script>
import categoryService from "@/modules/categories/api/service/category-service";
import fileService from "@/api/service/file-service";
import {mapGetters} from "vuex";
import CategoryAdd from "@/modules/categories/components/CategorySave";

export default {
  name: "category-list",
  components: {
    'category-save': CategoryAdd
  },
  data: () => ({
    category: null,
    subcategories: [],
    categoriesPath: null,
    isLoading: false,
    error: null,
    pagination: {
      currPage: 1,
      pageSize: 12,
      totalPages: 0
    },
    editCategory: {
      isEditing: false,
      name: null,
      id: null,
      imagePath: null
    }
  }),
  watch: {
    $route(to, from) {
      if (to.path.includes("categories") && from.path.includes("categories")) {
        this.category = null;
        this.subcategories = [];
        this.categoriesPath = null;
        this.editCategory.name = null;
        this.editCategory.isEditing = false;
        this.editCategory.id = null;
        this.editCategory.imagePath = null;
        this.error = null;
        this.pagination.currPage = 1;
        this.loadCategories();
        document.title = this.$route.meta.title;
      }
    }
  },
  computed: {
    ...mapGetters("user", ["isAdmin"])
  },
  created() {
    this.loadCategories();
    document.title = this.$route.meta.title;
  },
  methods: {
    createCategory() {
      this.editCategory.isEditing = true;
    },
    updateCategory(name, imagePath, id) {
      this.editCategory.id = id;
      this.editCategory.name = name;
      this.editCategory.imagePath = imagePath;
      this.editCategory.isEditing = true;
    },
    async confirmEdit(data) {
      this.editCategory.isEditing = false;
      this.isLoading = true;
      let categoryId;
      try {
        categoryId = (await (this.editCategory.id == null
            ? categoryService.createSubcategory({
              name: data.name,
              parentId: this.$route.params.id
            })
            : categoryService.updateSubcategory({
              name: data.name,
              parentId: this.$route.params.id,
              id: this.editCategory.id
            }))).data;
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
        }
      } else if (data.deleteImage) {
        try {
          await categoryService.deleteImage(categoryId);
        } catch (error) {
          this.setError("Не удалось удалить картинку");
        }
      }
      this.editCategory.id = null;
      this.editCategory.imagePath = null;
      this.editCategory.name = null;
      this.isLoading = false;
      await this.loadCategories();
    },
    cancelEdit() {
      this.editCategory.isEditing = false;
      this.editCategory.id = null;
      this.editCategory.imagePath = null;
      this.editCategory.name = null;
    },
    deleteCategory(categoryId) {
      categoryService.deleteCategory(categoryId)
          .then(async () => {
            await this.loadCategories();
            if (this.subcategories == null || this.subcategories.length === 0) {
              this.$router.push(`/categories/${this.$route.params.id}/items`);
            }
          })
          .catch(() => {
            this.setError("Не удалось удалить категорию");
          })
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
          const response = (await categoryService.getPrimal(this.pagination.currPage, this.pagination.pageSize)).data;
          this.subcategories = response.items;
          this.pagination.totalPages = response.totalPages;
        } else {
          const response = (await categoryService.getSubcategories(this.$route.params.id, this.pagination.currPage, this.pagination.pageSize)).data;
          if (response.body.name != null) {
            this.category = response.body.name;
            document.title = this.category;
          }
          this.categoriesPath = response.categoriesPath;
          this.subcategories = response.body.items.items;
          this.pagination.totalPages = response.body.items.totalPages;
        }
      } finally {
        this.isLoading = false;
      }
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
