<template>
  <input @change="changeFile($event.target.files)" type="file" />
  <button @click="processFile()">Parse</button>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import { parseString } from 'whatsapp-chat-parser'
import { Message } from 'whatsapp-chat-parser/types/types'

@Options({
  emits: ['newMessages']
})
export default class Select extends Vue {
  fr = new FileReader()
  file!: File
  text = ''
  messages!: Message[]

  mounted (): void {
    this.fr.onload = () => this.parseFile()
  }

  changeFile (files: File[]): void {
    this.file = files[0]
  }

  processFile (): void {
    this.fr.readAsText(this.file)
  }

  async parseFile (): Promise<void> {
    this.text = this.fr.result as string
    this.messages = await parseString(this.text)
    this.$emit('newMessages', this.messages)
  }
}
</script>
