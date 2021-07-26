<template>
  <div class="flex">
    <TabItem v-for="[key, tab] in tabs" :key="key" :name="tab.name" :isActive="activeKey == key" @click="$emit('update:activeKey', key)" @close="$emit('closeTab', key)"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import TabItem from 'components/ui/TabItem.vue'
import { GenericPaneTab } from 'types/TabsManager.class'

export default defineComponent({
  components: {
    TabItem
  },
  props: {
    activeKey: {
      type: String,
      required: true
    },
    tabs: {
      type: Object as PropType<ReadonlyMap<string, GenericPaneTab>>,
      required: true
    }
  }
})
</script>
