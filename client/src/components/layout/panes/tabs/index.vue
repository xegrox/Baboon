<template>
  <div class="flex">
    <TabBarItem v-for="(tab, index) in tabs" :key="index" :name="tab.path" :isActive="activeIndex == index"  @click="updateActive(index)" @close="removeTab(index)"></TabBarItem>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import TabBarItem from './TabBarItem.vue'

export default defineComponent({
  components: {
   TabBarItem
  },
  computed: {
    activeIndex() {
      return this.$accessor.tabs.activeIndex
    },
    tabs() {
      return this.$accessor.tabs.all
    }
  },
  methods: {
    updateActive(index: number) {
      this.$accessor.tabs.updateActive(index)
    },
    removeTab(index: number) {
      this.$accessor.tabs.remove(index)
    }
  }
})
</script>

<style scoped>
</style>
