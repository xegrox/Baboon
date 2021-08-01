<template>
  <div
    class="rounded-md border-2 border-gray-700 p-4 group bg-white bg-opacity-0 hover:bg-opacity-5 transition"
    :class="{ '!border-gray-500 bg-opacity-10': isActive }"
    @mouseenter="hover = true"
    @mouseleave="hover = false">
    <div class="flex gap-3 items-center">
      <transition-group name="list" @leave="animLeave">
        <p key="url" :class="{ '!text-gray-200': isActive }" class="flex-1 font-mono text-gray-400 group-hover:text-gray-300 transition truncate">{{ url }}</p>
        <ToggleSwitch key="toggle" :modelValue="isActive" @update:modelValue="$event ? activate() : deactivate()" class="transition"/>
        <div v-if="hover" class="flex-none transition">
          <SettingsIcon key="settings" class="flex-none h-5 w-5 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer" @click="openSettings()"/>
        </div>
      </transition-group>
    </div>
    <Settings ref="settings" :url="url" :lspClient="lspClient"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ProjectItem } from 'types/ProjectItem.class'
import ToggleSwitch from 'components/ui/ToggleSwitch.vue'
import { SettingsIcon } from '@zhuowenli/vue-feather-icons'
import Settings from './settings.vue'
import { LSPClient } from 'api/lsp'

export default defineComponent({
  components: {
    ToggleSwitch,
    SettingsIcon,
    Settings
  },
  props: {
    url: {
      type: String,
      required: true
    },
    lspClient: {
      type: Object as PropType<LSPClient>,
      required: true
    }
  },
  data() {
    return {
      hover: false
    }
  },
  methods: {
    async activate() {
      if (!this.activeProject) return
      let workspace = await this.lspClient.addWorkspace(this.activeProject.name, this.activeProject.path)
      this.activeProject.lspWorkspaces.set(this.url, workspace)
    },
    async deactivate() {
      if (!this.activeProject) return
      await this.lspClient.removeWorkspace(this.activeProject.path)
      this.activeProject.lspWorkspaces.delete(this.url)
    },
    openSettings() {
      (this.$refs.settings as any).open()
    },
    animLeave(el: Element) {
      // Retain same position after going absolute
      var elm = (el as HTMLElement)
      elm.style.left = elm.offsetLeft + 'px'
      elm.style.position = 'absolute'
    }
  },
  computed: {
    activeProject(): ProjectItem | undefined {
      return this.$accessor.projects.active
    },
    isActive(): boolean {
      return this.activeProject ? this.activeProject.lspWorkspaces.has(this.url) : false
    }
  }
})
</script>

<style lang="css" scoped>
.list-enter-from,
.list-leave-to {
  opacity: 0;
}
</style>
