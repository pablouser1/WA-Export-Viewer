<template>
  <Select v-if="!messages.length" @newMessages="setMessages" />
  <Viewer v-else :messages="messages" @reset="reset" />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Message } from 'whatsapp-chat-parser/types/types'
import Select from './components/Select.vue'
import Viewer from './components/Viewer.vue'

@Options({
  components: {
    Select, Viewer
  }
})
export default class App extends Vue {
  messages: Message[] = []

  setMessages (messages: Message[]): void {
    this.messages = []
    // eslint-disable-next-line
    console.log(`Loading ${messages.length} messages`)
    this.messages = messages
  }

  reset (): void {
    this.messages = []
  }
}
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
