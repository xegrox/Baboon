<template>
  <div>
    <Scrim :show="pinging"/>
    <Setup :show="!pinging && !connected" @done="connected = true"/>
    <div class="flex h-screen">
      <div class="flex flex-initial">
        <Projects class="flex-none w-20"/>
        <Explorer class="w-80"/>
      </div>
      <div class="flex-auto flex flex-col">
        <Tabs class="flex-none h-12 w-full"/>
        <Editor class="flex-1"></Editor>
      </div>
    </div>
    <AlertCenter/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Projects from '../components/layout/panes/projects/index.vue'
import Explorer from '../components/layout/panes/explorer/index.vue'
import Tabs from '../components/layout/panes/tabs/index.vue'
import Editor from '../components/layout/panes/editor/index.vue'
import Scrim from '../components/ui/Scrim.vue'
import Setup from '../components/layout/Setup.vue'
import AlertCenter from '../components/layout/AlertCenter.vue'
import { AlertType } from '../interfaces/AlertItem.interface'
import CodeMirror from 'codemirror'

export default defineComponent({
  name: 'Baboon',
  components: {
    Projects,
    Explorer,
    Tabs,
    Editor,
    Setup,
    Scrim,
    AlertCenter
  },
  data() {
    return {
      pinging: true,
      connected: false
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
    this.$accessor.tabs.add({
      path: 'index.js',
      doc: CodeMirror.Doc('index')
    })
    this.$accessor.tabs.add({
      path: 'babeler.js',
      doc: CodeMirror.Doc('babeler')
    })
  }
})
</script>

<css scoped>
</css>
