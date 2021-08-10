<template>
  <div class="flex bg-gray-900 border-t-2 border-gray-800 w-full gap-5 px-6 items-center">
    <Item class="ml-auto" text="LSP servers" @click="openRightPane('lsp_servers', { name: 'LSP servers', viewTag: 'lsp'})"/>
    <Item text="Shortcuts" @click="openRightPane('shortcuts', { name: 'Shortcuts', viewTag: 'shortcuts' })"/>
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
    openRightPane(key: string, tab: GenericPaneTab) {
      let tabs = this.$accessor.panes.right
      if (!tabs?.all.has(key)) tabs?.add(key, tab)
      tabs.active = key
    }
  }
})
</script>
