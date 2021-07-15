<template>
  <div class="bg-black">
    <Scrim :show="pinging"/>
    <Setup ref="setup" @done="$accessor.sftp.setConnected(true)" bindClass="z-30"/>
      <div class="flex h-screen">
        <ProjectBar class="flex-none w-20"/>
        <FadeTransition>
          <div v-if="this.$accessor.projects.all.size > 0" class="flex flex-col h-full w-full">
            <div class="flex flex-1">
              <Explorer class="flex-none w-80"/>
              <Editor class="flex-1"/>
            </div>
            <StatusBar class="h-8"/>
          </div>
        </FadeTransition>
      </div>
    <AlertCenter class="z-40"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ProjectBar from 'components/layout/projectBar/index.vue'
import Explorer from 'components/layout/panes/explorer/index.vue'
import Editor from 'components/layout/panes/editor/index.vue'
import StatusBar from 'components/layout/panes/statusBar/index.vue'
import Scrim from 'components/ui/Scrim.vue'
import Setup from 'components/layout/Setup.vue'
import AlertCenter from 'components/layout/AlertCenter.vue'
import FadeTransition from 'components/ui/transitions/Fade.vue'
import { AlertType } from 'types/AlertItem.interface'
import { ProjectItem } from 'types/ProjectItem.class'
import { Pong } from 'api/sftp'

export default defineComponent({
  name: 'Baboon',
  components: {
    ProjectBar,
    Explorer,
    Editor,
    StatusBar,
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
  mounted() {
    this.$watch('isConnected', (connected: boolean) => {
      var setup = this.$refs.setup as any
      connected ? setup.close() : setup.open()
    }, { immediate: true })
  },
  computed: {
    isConnected(): boolean {
      return this.$accessor.sftp.connected
    },
    activeProject(): ProjectItem {
      var projectStore = this.$accessor.projects
      return projectStore.all.get(projectStore.activePath)!
    }
  },
  beforeCreate() {
    this.$sftp.ping().then((data) => {
      switch(data) {
        case Pong.connected:
          this.$accessor.sftp.setConnected(true)
          break
        case Pong.disconnected:
          this.$accessor.alert.add({
            type: AlertType.Error,
            title: 'SFTP connection lost'
          })
          this.$sftp.disconnect()
      }
      this.pinging = false
    }).catch(() => {})
  }
})
</script>
