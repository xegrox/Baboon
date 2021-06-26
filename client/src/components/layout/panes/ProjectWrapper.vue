<!-- TODO: get rid of this stupid wrapper -->

<template>
  <div class="relative">
    <div v-for="[key, project] in projects" :key="key" class="w-full h-full absolute" :class="{ 'pointer-events-none': !isActive(project.path) }">
      <FadeTransition v-show="isActive(project.path)" class="duration-500 w-full h-full">
        <slot :project="project"/>
      </FadeTransition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import FadeTransition from 'components/ui/transitions/Fade.vue'

export default defineComponent({
  components: {
    FadeTransition
  },
  computed: {
    projects() {
      return this.$accessor.projects.all
    },
  },
  methods: {
    isActive(path: string) {
      return this.$accessor.projects.activePath === path
    }
  }
})
</script>
