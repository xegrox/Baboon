<template>
  <div>
    <Scrim :show="pinging"/>
    <Setup :show="!pinging && !connected" @done="connected = true"/>
    <div class="flex h-screen">
      <div class="flex flex-initial">
        <Projects class="flex-none w-20"/>
        <Explorer class="w-80"/>
      </div>
      <ProjectWrapper class="flex-auto">
        <template v-slot="slotProps">
          <Editor class="h-full" :project="slotProps.project"/>
        </template>
      </ProjectWrapper>
    </div>
    <AlertCenter/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Projects from '../components/layout/panes/projects/index.vue'
import Explorer from '../components/layout/panes/explorer/index.vue'
import Editor from '../components/layout/panes/editor/index.vue'
import ProjectWrapper from '../components/layout/panes/ProjectWrapper.vue'
import Scrim from '../components/ui/Scrim.vue'
import Setup from '../components/layout/Setup.vue'
import AlertCenter from '../components/layout/AlertCenter.vue'
import { AlertType } from '../types/AlertItem.interface'
import { ProjectItem } from '../types/ProjectItem.class'

export default defineComponent({
  name: 'Baboon',
  components: {
    Projects,
    Explorer,
    Editor,
    ProjectWrapper,
    Setup,
    Scrim,
    AlertCenter
  },
  data() {
    return {
      pinging: true,
      connected: false,
      test: true
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
          this.connected = true
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
  },
  beforeMount() {
    var proj = new ProjectItem('test')
    proj.addTab({
      path: 'babeler.js',
    })
    proj.addTab({
      path: 'index.js',
    })
    var proj2 = new ProjectItem('another')
    proj2.addTab({
      path: 'another.js',
    })
    this.$accessor.projects.add(proj)
    this.$accessor.projects.add(proj2)
    this.$accessor.projects.updateActive('test')
  }
})
</script>
