<template>
  <div class="flex bg-white bg-opacity-10">
    <TabItem
      v-for="[key, tab] in tabs" :key="key"
      :name="tab.relPath" :isActive="activeRelPath === tab.relPath"
      :isModified="tab.modified" :isSaving="tab.saving"
      @click="$emit('update:activeRelPath', tab.relPath)"
      @close="$emit('closeTab', tab.relPath)"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { EditorPaneTab } from 'types/ProjectItem.class'
import TabItem from 'components/ui/TabItem.vue'

export default defineComponent({
  components: {
   TabItem
  },
  props: {
    rootPath: {
      type: String,
      required: true
    },
    tabs: {
      type: Object as PropType<ReadonlyMap<string, EditorPaneTab>>,
      required: true
    },
    activeRelPath: {
      type: String,
      required: true
    }
  }
})
</script>
