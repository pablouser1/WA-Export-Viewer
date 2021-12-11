<template>
  <section class="hero is-primary is-fullheight">
    <div class="hero-body">
      <div class="container">
        <p class="title">Whatsapp Export Viewer</p>
        <div class="field">
          <div class="control">
            <div class="file is-boxed is-success has-name">
              <label class="file-label">
                <input class="file-input" accept="text/plain" @change="changeFile($event.target.files)" type="file" />
                <span class="file-cta">
                  <span class="file-icon">
                    <fa-icon icon="upload" />
                  </span>
                  <span class="file-label">Choose a valid txt</span>
                </span>
                <span id="file-name" class="file-name">No file selected</span>
              </label>
            </div>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <button class="button is-success" :class="{'is-loading': isParsing}" @click="processFile()">Parse</button>
          </div>
        </div>
      </div>
    </div>
  </section>
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
  nameContainer!: HTMLElement
  isParsing = false

  mounted (): void {
    this.fr.onload = () => this.parseFile()
    this.nameContainer = document.getElementById('file-name') as HTMLElement
  }

  changeFile (files: File[]): void {
    this.file = files[0]
    this.nameContainer.innerText = files[0].name
  }

  processFile (): void {
    this.isParsing = true
    this.fr.readAsText(this.file)
  }

  async parseFile (): Promise<void> {
    this.text = this.fr.result as string
    this.messages = await parseString(this.text)
    this.isParsing = false
    this.$emit('newMessages', this.messages)
  }
}
</script>
