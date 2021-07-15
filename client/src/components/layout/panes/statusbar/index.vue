<template>
  <div class="flex bg-gray-900 border-t-2 border-gray-800 w-full gap-5 px-6 items-center">
    <Item class="ml-auto" text="LSP servers"/>
    <Item text="Shortcuts"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Item from './item.vue'

export default defineComponent({
  components: {
    Item
  }
})
</script>

<style lang="css" scoped>
</style>
