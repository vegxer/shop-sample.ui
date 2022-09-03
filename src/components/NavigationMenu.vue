<template>
  <div class="mb-10 d-flex">
    <v-btn class="pt-0 pb-0 pl-0 pr-2" @click="$router.push('/categories')" large plain>Категории</v-btn>
    <v-icon v-if="currentName != null">mdi-chevron-right</v-icon>
    <div v-for="category in categoriesPath" :key="category.id">
      <v-btn class="pt-0 pb-0 pl-1 pr-1" :to="categoryPath(category.id)" large plain>{{ category.name }}</v-btn>
      <v-icon>mdi-chevron-right</v-icon>
    </div>
    <v-btn class="pl-1 pr-0 pt-0 pb-0" large plain>{{ currentName }}</v-btn>
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
  methods: {
    categoryPath(categoryId) {
      return `/categories/${categoryId}` + (this.$router.currentRoute.path.includes("products") && categoryId === this.categoriesPath[this.categoriesPath.length - 1].id
          ? "/items"
          : "");
    }
  }
}
</script>