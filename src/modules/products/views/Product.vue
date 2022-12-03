<template>
  <div>
    <div v-if="isLoading">
      <v-row justify="center" no-gutters class="my-12">
        <v-progress-circular indeterminate color="primary" size="64"/>
      </v-row>
    </div>

    <div v-else-if="product">
      <navigation-menu :current-name="product.name" :categories-path="categoriesPath"/>
      <v-btn v-if="isAdmin && !editing" class="mt-2" color="primary" @click="startEdit">Редактировать</v-btn>
      <div v-if="editing" class="mt-5">
        <v-btn class="mr-2" color="error" @click="cancelEditing">Отмена</v-btn>
        <v-btn color="success" @click="saveProduct" :disabled="!editDataValid">Сохранить</v-btn>
      </div>
      <v-row class="mt-2">
        <v-col cols="6">
          <v-card elevation="5" outlined>
            <v-img v-if="(editing && (editData?.imagePaths == null || editData?.imagePaths.length === 0)) || (!editing && (product?.imagePaths == null || product.imagePaths.length === 0))"
                   height="400"
                   src="@/assets/no_photo.png">
              <div v-if="editing" class="edit-buttons">
                <v-icon title="Добавить картинку" color="success" x-large @click="chooseFile">mdi-plus</v-icon>
                <input accept="image/*" @change="saveFile" type="file" id="selectedFileEmpty" style="display: none"/>
              </div>
            </v-img>
            <v-carousel v-else hide-delimiter-background>
              <v-carousel-item
                  v-for="(image, i) in editing ? editData.imagePaths : product.imagePaths"
                  :key="i"
                  reverse-transition="fade-transition"
                  transition="fade-transition">
                <v-img height="600" :src="image.path?.startsWith('blob') ? image.path : fullPath(image)"
                       :gradient="image.deleted ? 'to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)' : ''">
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
                  <div v-if="editing" class="edit-buttons">
                    <v-icon v-if="image.deleted" title="Восстановить" color="success" x-large
                            @click="recoverImage(image)">mdi-arrow-u-right-bottom
                    </v-icon>
                    <v-icon v-else title="Удалить" color="error" x-large @click="deleteImage(image)">mdi-delete</v-icon>
                    <v-icon title="Добавить картинку" color="success" x-large @click="chooseFile">mdi-plus</v-icon>
                    <input accept="image/*" @change="saveFile" type="file" id="selectedFile" style="display: none"/>
                  </div>
                </v-img>
              </v-carousel-item>
            </v-carousel>
          </v-card>
        </v-col>

        <v-col cols="6">
          <v-form v-model="editDataValid" ref="form">
            <h1 v-if="!editing" class="mb-3">
              {{ product.name }}
            </h1>
            <v-text-field v-else v-model="editData.name" required label="Название" :rules="editRules.name">
            </v-text-field>
            <div v-if="!editing" class="green--text pb-0 text-h4 mb-3">{{ product.price }} ₽</div>
            <v-text-field v-else v-model="editData.price" required label="Цена" type="number" :rules="editRules.price">
            </v-text-field>
            <v-text-field v-if="editing" v-model="editData.amount" required label="Количество" type="number"
                          :rules="editRules.amount">
            </v-text-field>
            <v-select v-if="editing" v-model="editData.state" :items="availabilityItems" item-text="text"
                      item-value="value">
            </v-select>
            <div v-if="(product.state === 'UNAVAILABLE' || product.amount === 0) && !editing"
                 class="red--text pb-0 text-h6 mb-3">Нет в
              наличии
            </div>
            <div v-else-if="!editing" class="text-h6">В наличии {{ product.amount }} штук</div>
          </v-form>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-textarea :readonly="!editing" @change="changeDescription" :value="editing ? editData.description : product.description" auto-grow rows="1" label="Описание"/>
        </v-col>
      </v-row>
    </div>
    <v-snackbar color="red" :value="error != null">
      {{ error }}
      <template #action="{ attrs }">
        <v-btn text v-bind="attrs" @click="error = null">
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import productService from "@/modules/products/api/service/products-service";
import fileService from "@/api/service/file-service";
import {mapGetters} from "vuex";

export default {
  name: "product",

  data: () => ({
    product: null,
    error: null,
    isLoading: false,
    categoriesPath: null,
    editing: false,
    editData: null,
    editDataValid: null,
    availabilityItems: [
      {value: 'AVAILABLE', text: 'В наличии'},
      {value: 'UNAVAILABLE', text: 'Нет в наличии'}
    ],
    editRules: {
      name: [
        (v) => !!v || 'Необходимо название',
        (v) => v?.length > 2 || 'Длина названия должна быть не меньше трёх символов'
      ],
      price: [
        (v) => !!v || 'Необходима цена',
        (v) => v >= 0 || 'Цена должна быть неотрицательной'
      ],
      amount: [
        (v) => !!v || 'Необходимо количество товара',
        (v) => v >= 0 || 'Количество товара должно быть неотрицательным'
      ]
    }
  }),
  computed: {
    ...mapGetters("user", ["isAdmin"])
  },
  created() {
    this.fetchProduct();
  },
  methods: {
    changeDescription(text) {
      (this.editing ? this.editData : this.product).description = text;
    },
    saveFile() {
      if (this.editData.imagePaths == null) {
        this.editData.imagePaths = [];
      }
      const inputElement = document.getElementById(this.editData.imagePaths.length === 0 ? 'selectedFileEmpty' : 'selectedFile');
      const blob = inputElement.files[0];
      this.editData.imagePaths.push({
        path: URL.createObjectURL(blob),
        deleted: false,
        blob: blob
      });
    },
    chooseFile() {
      document.getElementById(this.editData?.imagePaths?.length > 0 ? 'selectedFile' : 'selectedFileEmpty').click();
    },
    startEdit() {
      this.editData = {...this.product};
      this.editData.imagePaths = this.editData.imagePaths
          .map(imagePath => {
            return {
              path: imagePath,
              deleted: false
            }
          });
      this.editData.imageThumbnailPaths = undefined;
      this.editData.categoryId = this.categoriesPath[this.categoriesPath.length - 1]?.id;
      this.editing = true;
    },
    cancelEditing() {
      this.editData = null;
      this.editing = false;
    },
    deleteImage(name) {
      this.editData.imagePaths.find(imagePath => imagePath === name).deleted = true;
    },
    recoverImage(name) {
      this.editData.imagePaths.find(imagePath => imagePath === name).deleted = false;
    },
    async fetchProduct() {
      this.isLoading = true;

      try {
        this.setProductFields((await productService.getProduct(this.$route.params.id)).data);
      } finally {
        this.isLoading = false;
      }
    },
    async saveProduct() {
      this.isLoading = true;
      try {
        try {
          for (const image of this.editData?.imagePaths?.filter(image => image.deleted)) {
            if (image.blob == null) {
              await productService.deleteFile(this.$route.params.id, image.path);
            }
          }
        } catch (error) {
          this.setError("Ошибка при удалении картинки");
        }
        try {
          for (const image of this.editData?.imagePaths?.filter(image => !image.deleted && image.blob != null)) {
            await productService.uploadFile(image.blob, this.$route.params.id);
          }
        } catch (error) {
          this.setError("Ошибка при загрузке картинки");
        }
        this.setProductFields((await productService.updateProduct(this.editData)).data);
      } catch (error) {
        this.setError("Ошибка при обновлении товара");
      } finally {
        this.editing = false;
        this.editData = null;
        this.isLoading = false;
      }
    },
    setProductFields(response) {
      this.categoriesPath = response.categoriesPath;
      this.product = response.body;
      document.title = this.product.name;
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
      if (name.path != null) {
        return fileService.buildFullAttachmentPath(name.path);
      }
      return fileService.buildFullAttachmentPath(name);
    }
  }
};
</script>
<style scoped>
.edit-buttons {
  position: absolute;
  right: 0
}
</style>
