<template>
    <div class="flex flex-col">
      <Tabs :project="project" class="flex-none h-12"/>
      <CodeViews :project="project" class="flex-1"/>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ProjectItem } from '../../../../types/ProjectItem.class'
import Tabs from './tabs/index.vue'
import CodeViews from './codeviews/index.vue'

export default defineComponent({
  components: {
    Tabs,
    CodeViews
  },
  props: {
    project: {
      type: Object as PropType<ProjectItem>,
      required: true
    },
  }
})
</script>
