<template>
  <div class="overflow-auto relative">
    <transition-group name="list">
      <div
        v-for="[key] in lspClients"
        :key="key"
        @click="toggleActiveUrl(key)"
        class="py-2 transition">
        <div
          class="flex gap-2 rounded-md border-2 border-gray-700 p-4 items-center group bg-white bg-opacity-0 hover:bg-opacity-5 transition"
          :class="{ '!border-gray-500 bg-opacity-10': key === activeUrl}">
          <p :class="{ '!text-gray-200': key === activeUrl }" class="flex-1 font-mono text-gray-400 group-hover:text-gray-300 transition-colors">{{ key }}</p>
          <TrashIcon class="flex-none text-gray-500 hover:text-red-400 transition-colors" @click="removeUrl(key)"/>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { TrashIcon } from '@zhuowenli/vue-feather-icons'
import { LanguageServerClient } from 'api/lsp'
import { ProjectItem } from 'types/ProjectItem.class'

export default defineComponent({
  components: {
    TrashIcon
  },
  methods: {
    toggleActiveUrl(url: string) {
      if (this.activeProject) {
        if (this.activeProject.lspServerUrl === url) this.activeProject.lspServerUrl = ''
        else this.activeProject.lspServerUrl = url
      }
    },
    removeUrl(url: string) {
      this.lspClients.delete(url)
    }
  },
  computed: {
    lspClients(): Map<string, LanguageServerClient> {
      return this.$accessor.lspservers.all
    },
    activeProject(): ProjectItem | undefined {
      let projects = this.$accessor.projects
      return projects.all.get(projects.activePath)
    },
    activeUrl(): string | undefined {
      return this.activeProject?.lspServerUrl
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
