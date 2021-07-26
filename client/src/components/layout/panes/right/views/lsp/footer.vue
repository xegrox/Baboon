<template>
  <div class="flex flex-col gap-4">
    <div>
      <ErrorLabel :errorMsg="errorMsg"/>
      <TextInput prefix="ws://" placeholder="Url" v-model="url" @update:modelValue="url = $event ?? ''" :disabled="loading" @input="errorMsg = ''" @enter="submit()"/>
    </div>
    <ProgressButton ref="submit" @click="addServer(url)" :loading="loading" :disabled="btnDisabled">Add</ProgressButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ErrorLabel from 'components/ui/ErrorLabel.vue'
import TextInput from 'components/ui/TextInput.vue'
import ProgressButton from 'components/ui/ProgressButton.vue'
import { Client } from 'rpc-websockets'
import { LanguageServerClient } from 'api/lsp'

export default defineComponent({
  components: {
    ErrorLabel,
    TextInput,
    ProgressButton
  },
  data() {
    return {
      url: '',
      loading: false,
      errorMsg: ''
    }
  },
  computed: {
    btnDisabled(): boolean {
      return this.url === '' || this.$accessor.lspservers.all.get(this.url) ? true: false
    }
  },
  methods: {
    submit() {
      ((this.$refs.submit as any).$el as HTMLElement).click()
    },
    addServer(url: string) {
      this.errorMsg = ''
      this.loading = true
      try {
        let client  = new Client('ws://' + url, { reconnect: false })

        client.on('error', () => {
          this.loading = false
          this.errorMsg = 'Connection error'
        })

        client.on('open', () => {
          let lspClient = new LanguageServerClient(client)
          lspClient.initialize().then(() => {
            this.$accessor.lspservers.all.set(url, lspClient)
            client.removeAllListeners('error')
            client.on('close', () => {
              this.$accessor.lspservers.all.delete(url)
            })
          }).catch((e) => {
            let msg = (e as Error).message
            msg = msg.charAt(0).toUpperCase() + msg.slice(1);
            this.errorMsg = msg
          }).finally(() => this.loading = false)
        })
      } catch(e) {
        this.loading = false
        let err = e as DOMException
        switch(err.name) {
          case 'SecurityError':
            this.errorMsg = 'The port is being blocked'
            break
          case 'SyntaxError':
            this.errorMsg = 'Invalid url'
        }
      }
    }
  }
})
</script>

<style lang="css" scoped>
</style>
