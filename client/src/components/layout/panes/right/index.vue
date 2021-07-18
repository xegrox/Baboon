<template>
    <div v-if="tabs.all.size > 0" class="h-full flex flex-col bg-white bg-opacity-10 border-l-2 border-gray-800">
      <Tabs class="flex-none h-12"
        :tabs="tabs.all"
        :activeKey="tabs.active"
        @update:activeKey="tabs.active = $event"
        @closeTab="tabs.remove($event)"
      />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Tabs from './tabs/index.vue'

export default defineComponent({
  components: {
    Tabs
  },
  computed: {
    tabs() {
      return this.$accessor.panes.right
    }
  }
})
</script>
