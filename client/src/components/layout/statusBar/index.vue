<template>
  <div class="flex bg-gray-900 border-t-2 border-gray-800 w-full gap-5 px-6 items-center">
    <Item class="ml-auto" text="LSP servers" @click="togglePane('lsp_servers', { name: 'LSP servers', componentTag: 'LSP' })"/>
    <Item text="Shortcuts"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Item from './item.vue'
import { GenericPaneTab } from 'types/TabsManager.class'

export default defineComponent({
  components: {
    Item
  },
  methods: {
    togglePane(key: string, tab: GenericPaneTab) {
      let tabs = this.$accessor.panes.right
      tabs?.all.has(key) ?  tabs?.remove(key) : tabs?.add(key, tab)
    }
  }
})
</script>
