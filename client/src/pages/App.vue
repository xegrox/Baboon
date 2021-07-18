<template>
  <div class="bg-black">
    <Scrim :show="pinging"/>
    <Setup ref="setup" @done="$accessor.sftp.setConnected(true)" bindClass="z-30"/>
      <div class="flex h-screen">
        <ProjectBar class="flex-none w-20"/>
        <div class="flex-1 flex flex-col">
          <div class="flex flex-1">
            <FadeTransition class="flex-1">
              <div v-if="this.$accessor.projects.all.size > 0" class="flex">
                <ExplorerPane class="flex-none w-80"/>
                <EditorPane class="flex-1"/>
              </div>
              <div v-else class="flex-1"/>
            </FadeTransition>
            <RightPane class="flex-none w-80"/>
          </div>
          <StatusBar class="flex-none h-8"/>
        </div>
      </div>
    <AlertCenter class="z-40"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ProjectBar from 'components/layout/projectBar/index.vue'
import StatusBar from 'components/layout/statusBar/index.vue'
import ExplorerPane from 'components/layout/panes/explorer/index.vue'
import EditorPane from 'components/layout/panes/editor/index.vue'
import RightPane from 'components/layout/panes/right/index.vue'
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
    StatusBar,
    ExplorerPane,
    EditorPane,
    RightPane,
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
