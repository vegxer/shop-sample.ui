<template>
  <div class="mb-3">
    <v-btn class="pl-0 pr-0" v-for="item in items" :key="item.id" @click="item.id == null ? null : $router.push(categoryPath(item.id))" large plain>
      <v-icon dense v-if="item.id !== '' && item.name != null">mdi-chevron-right</v-icon>
      {{ item.name }}
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "NavigationMenu",
  props: {
    currentName: {
      type: String,
      required: false
    },
    categoriesPath: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data() {
    return {
      items: Array.of({id: '', name: "Категории"}, ...(this.categoriesPath ?? []), {name: this.currentName})
    };
  },
  methods: {
    categoryPath(categoryId) {
      return `/categories/${categoryId}` + (this.$router.currentRoute.path.includes("products") && categoryId === this.categoriesPath[this.categoriesPath.length - 1].id
          ? "/items"
          : "");
    }
  }
}
</script>