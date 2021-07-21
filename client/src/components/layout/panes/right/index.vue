<template>
    <transition name="slide">
      <div v-if="tabs.all.size > 0" class="h-full flex flex-col bg-white bg-opacity-10 border-l-2 border-gray-800">
        <Tabs class="flex-none h-12"
          :tabs="tabs.all"
          :activeKey="tabs.active"
          @update:activeKey="tabs.active = $event"
          @closeTab="tabs.remove($event)"
        />
        <div class="relative flex-1 w-80">
          <FadeTransition v-for="[key, item] in views" :key="key" class="absolute w-full h-full">
            <component v-show="key === tabs.active" :is="item"/>
          </FadeTransition>
        </div>
      </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, Component } from 'vue'
import FadeTransition from 'components/ui/transitions/Fade.vue'
import Tabs from './tabs/index.vue'
import { TabsManager } from 'types/TabsManager.class'

export default defineComponent({
  components: {
    FadeTransition,
    Tabs
  },
  computed: {
    tabs(): TabsManager {
      return this.$accessor.panes.right
    },
    views(): Map<string, Component> {
      let views = new Map<string, Component>()
      this.$accessor.panes.right.all.forEach((tab, key) => {
        views.set(key, defineAsyncComponent(() => import(`./views/${tab.viewTag}/index.vue`)))
      })
      return views
    }
  }
})
</script>

<style scoped>
.slide-leave-active,
.slide-enter-active {
  transition: .25s;
}
.slide-enter-from, .slide-leave-to {
  width: 0;
  opacity: 0;
}
</style>
