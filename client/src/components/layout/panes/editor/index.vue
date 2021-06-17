<template>
  <TransitionFade>
    <div class="flex flex-col">
      <Tabs :project="project" class="flex-none h-12"/>
      <CodeMirror :project="project" class="flex-1"/>
    </div>
  </TransitionFade>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ProjectItem } from '../../../../types/ProjectItem.class'
import Tabs from './tabs/index.vue'
import TransitionFade from '../../../ui/transitions/Fade.vue'
import CodeMirror from './codemirror/index.vue'

export default defineComponent({
  components: {
    Tabs,
    TransitionFade,
    CodeMirror
  },
  props: {
    project: {
      type: Object as PropType<ProjectItem>,
      required: true
    },
  }
})
</script>
