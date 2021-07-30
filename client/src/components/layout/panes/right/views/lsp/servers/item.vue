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
    <Settings ref="settings" :url="url" :lspEntry="lspEntry"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ProjectItem } from 'types/ProjectItem.class'
import { LSPEntry } from 'types/LSPEntry.class'
import ToggleSwitch from 'components/ui/ToggleSwitch.vue'
import { SettingsIcon } from '@zhuowenli/vue-feather-icons'
import Settings from './settings.vue'

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
    lspEntry: {
      type: Object as PropType<LSPEntry>,
      required: true
    }
  },
  data() {
    return {
      hover: false
    }
  },
  methods: {
    activate() {
      let lspEntry = this.$accessor.lspclients.all.get(this.url)
      if (!this.activeProject || !lspEntry) return
      this.activeProject.lspServerUrls.add(this.url)
      lspEntry.client.notifyWorkspaceAdd(this.activeProject.name, this.activeProject.path)
    },
    deactivate() {
      let lspEntry = this.$accessor.lspclients.all.get(this.url)
      if (!this.activeProject || !lspEntry) return
      this.activeProject.lspServerUrls.delete(this.url)
      lspEntry.client.notifyWorkspaceRemove(this.activeProject.name, this.activeProject.path)
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
      return this.activeProject ? this.activeProject.lspServerUrls.has(this.url) : false
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
