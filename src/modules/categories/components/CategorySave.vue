<template>
  <div class="text-center">
    <v-dialog :value="true" width="440">

      <v-card>
        <v-form ref="form" class="pl-5 pr-5 pt-5">
          <v-text-field
              prepend-icon="mdi-tag"
              label="Название"
              v-model="newName"
              :rules="newNameRules"
              required
          ></v-text-field>
          <v-file-input
              label="Загрузите картинку"
              prepend-icon="mdi-camera"
              accept="image/*"
              v-model="fileBlob"
              @change="selectImage"
          ></v-file-input>
          <v-img v-if="previewImage != null" :src="previewImage" alt="Изображение"/>
        </v-form>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              text
              @click="$emit('cancel')">
            Отмена
          </v-btn>
          <v-btn
              color="success"
              text
              @click="confirm()">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import fileService from "@/api/service/file-service";

export default {
  name: "category-add",
  props: {
    name: {
      type: String,
      required: false
    },
    imagePath: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      newName: this.name,
      previewImage: this.imagePath == null ? null : fileService.buildFullAttachmentPath(this.imagePath),
      fileBlob: this.imagePath == null ? null : {name: "Изображение"},
      imageUpdated: false,
      valid: false,
      newNameRules: [
        (v) => !!v || 'Необходимо название',
        (v) => v?.length > 2 || 'Название должно быть не короче трёх символов'
      ]
    };
  },
  methods: {
    selectImage(image) {
      this.imageUpdated = true;
      this.previewImage = image == null ? null : URL.createObjectURL(this.fileBlob);
    },
    confirm() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.$emit('save', {
        name: this.newName,
        fileBlob: this.fileBlob,
        updateImage: this.imageUpdated && this.fileBlob != null,
        deleteImage: this.imageUpdated && this.fileBlob == null && this.imagePath != null
      });
    }
  }
}
</script>