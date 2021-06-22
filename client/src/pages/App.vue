<template>
  <div class="bg-black">
    <Scrim :show="pinging"/>
    <Setup :show="!pinging && !$accessor.sftp.connected" @done="$accessor.sftp.setConnected(true)" class="z-30"/>
    <div class="flex h-screen">
      <div class="flex flex-initial">
        <Projects class="flex-none w-20"/>
      </div>
      <FadeTransition>
        <div v-if="this.$accessor.projects.all.size > 0" class="flex h-full w-full">
          <Explorer class="flex-none w-80"/>
          <Editor class="flex-1"/>
        </div>
      </FadeTransition>
    </div>
    <AlertCenter class="z-40"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Projects from 'components/layout/panes/projects/index.vue'
import Explorer from 'components/layout/panes/explorer/index.vue'
import Editor from 'components/layout/panes/editor/index.vue'
import Scrim from 'components/ui/Scrim.vue'
import Setup from 'components/layout/Setup.vue'
import AlertCenter from 'components/layout/AlertCenter.vue'
import FadeTransition from 'components/ui/transitions/Fade.vue'
import { AlertType } from 'types/AlertItem.interface'
import { ProjectItem } from 'types/ProjectItem.class'

export default defineComponent({
  name: 'Baboon',
  components: {
    Projects,
    Explorer,
    Editor,
    Setup,
    FadeTransition,
    Scrim,
    AlertCenter
  },
  data() {
    return {
      pinging: true
    }
  },
  computed: {
    activeProject(): ProjectItem {
      var projectStore = this.$accessor.projects
      return projectStore.all.get(projectStore.activePath)!
    }
  },
  beforeCreate() {
    this.$sftp.ping().exec({
      onSuccess: (data) => {
        if (data.hasConnection) {
          this.$accessor.sftp.setConnected(true)
        } else {
         if (data.hasClient) {
           this.$accessor.alerts.add({
             type: AlertType.Error,
             title: 'SFTP connection lost'
           })
           this.$sftp.disconnect().exec()
         }
       }
       this.pinging = false
      },
      onError: () => {}
    })
  }
})
</script>
