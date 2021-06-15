<template>
  <div id="root" class="flex flex-col absolute top-0 right-0 pt-5 z-40 overflow-hidden h-full justify-end transition-all pointer-events-none">
    <transition-group name="alert-list" @leave="animLeave">
      <Alert v-for="[key, value] in alerts" :key="key" :title="value.item.title" :count="value.count" :content="value.item.content" :type="value.item.type" class="alert-item transition-all duration-500 mb-3 pointer-events-auto" @close="remove(key)"/>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { AlertItem } from '../../interfaces/AlertItem.interface'
import Alert from '../ui/Alert.vue'

export default defineComponent({
  components: {
    Alert
  },
  computed: {
    alerts() {
      return this.$accessor.alerts.all
    }
  },
  methods: {
    remove(key: number) {
      this.$accessor.alerts.remove(key)
    },
    animLeave(el: Element) {
      // Retain same position after going absolute
      var elm = (el as HTMLElement)
      var width = getComputedStyle(el).width
      elm.style.top = elm.offsetTop + 'px'
      elm.style.position = 'absolute'
      elm.style.width = width
    }
  }
})
</script>

<style scoped>
#root {
  --margin-right: 0.75rem;
  padding-right: var(--margin-right);
  --root-width: 24rem;
  width: var(--root-width);
}

.alert-list-enter-from,
.alert-list-leave-to {
  opacity: 0;
  transform: translate(30px);
}
</style>
