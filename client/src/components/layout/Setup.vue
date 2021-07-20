<template>
  <Modal ref="modal">
    <div class="flex flex-col w-64 gap-y-4">
      <h1 class="text-2xl font-black text-white">Connect with SFTP</h1>
      <div/>
      <TextInput ref="input_1" v-model.trim="sftp.host" placeholder="Hostname" :disabled="loading" @enter="focusRef('input_2')"/>
      <TextInput ref="input_2" v-model.trim="sftp.port" placeholder="Port" type="number" :disabled="loading" @enter="focusRef('input_3')"/>
      <TextInput ref="input_3" v-model.trim="sftp.username" placeholder="Username" :disabled="loading" @enter="focusRef('input_4')"/>
      <TextInput ref="input_4" v-model="sftp.password" placeholder="Password" type="password" :disabled="loading" @enter="submit"/>
      <div/>
      <ProgressButton ref="submit" @click="post_sftp" :loading="loading" :disabled="!all_filled" indeterminate>
        Connect
      </ProgressButton>
    </div>
  </Modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Modal from 'components/ui/Modal.vue'
import TextInput from 'components/ui/TextInput.vue'
import ProgressButton from 'components/ui/ProgressButton.vue'
import { AlertType } from 'types/AlertItem.interface'

export default defineComponent({
  components: {
    Modal,
    TextInput,
    ProgressButton
  },
  data() {
    return {
      sftp: {
        host: '',
        port: '',
        username: '',
        password: '',
      },
      loading: false
    }
  },
  computed: {
    all_filled(): Boolean {
      if (this.sftp.host === '' || this.sftp.port === '' || this.sftp.username === '' || this.sftp.password === '') return false
      return true
    }
  },
  methods: {
    open() { (this.$refs.modal as any).open() },
    close() { (this.$refs.modal as any).close() },
    focusRef(refName: string) {
      (this.$refs[refName] as any).focus()
    },
    submit() {
      ((this.$refs.submit as any).$el as HTMLElement).click()
    },
    post_sftp() {
      this.loading = true
      this.$sftp.connect({
        host: this.sftp.host,
        port: parseInt(this.sftp.port),
        username: this.sftp.username,
        password: this.sftp.password
      }).then((id) => {
        this.$accessor.sftp.setSessionId(id)
        this.$emit('done')
        this.$accessor.alerts.add({
          type: AlertType.Success,
          title: 'Connected via SFTP'
        })
      }).catch(() => {}).finally(() => this.loading = false)
    }
  }
})
</script>
