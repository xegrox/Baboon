<template>
  <div class="overflow-auto relative">
    <transition-group name="list">
      <div
        v-for="[key, client] in lspClients"
        :key="key"
        class="py-2 transition">
        <Item :url="key" :lspClient="client"/>
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Item from './item.vue'
import { LSPClient } from 'api/lsp'

export default defineComponent({
  components: {
    Item
  },
  computed: {
    lspClients(): Map<string, LSPClient> {
      return this.$accessor.lspclients.all
    }
  }
})
</script>

<style scoped>
.list-enter-from,
.list-leave-to {
  opacity: 0;
}

.list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
