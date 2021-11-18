<template>
  <select v-model="active">
    <option v-for="(participant, i) in participants" :key="'participant' + i" :value="participant">{{ participant }}</option>
  </select>
  <div class="container">
    <div class="msg" v-for="(message, i) in messages" :key="'message' + i">
      <div class="bubble" v-bind:class="{ alt: isPrimary(message.author) && !isChained(i), follow: isChained(i) && !isPrimary(message.author), altfollow: isPrimary(message.author) && isChained(i) }">
        <div class="txt">
          <p class="name" v-if="!isChained(i)">{{ message.author }}</p>
          <span class="timestamp">{{ parseDate(message.date) }}</span>
          <p class="message" v-bind:class="{follow: isChained(i)}">{{ message.message }}</p>
        </div>
        <div v-if="!isChained(i)" class="bubble-arrow" v-bind:class="{alt: isPrimary(message.author) }"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import { Message } from 'whatsapp-chat-parser/types/types'

@Options({
  props: {
    messages: Array
  }
})
export default class Viewer extends Vue {
  messages: Message[] = []
  participants: string[] = []
  active = ''

  mounted (): void {
    this.refresh()
  }

  refresh (): void {
    this.setParticipants()
    this.active = this.participants[0]
  }

  setParticipants (): void {
    this.messages.map(message => {
      if (!this.participants.includes(message.author) && message.author !== 'System') {
        this.participants.push(message.author)
      }
    })
  }

  // Check if last message was also made by the same author
  isChained (index: number): boolean {
    const last = index - 1
    return last >= 0 && this.messages[index].author === this.messages[last].author
  }

  // Check if the author is the active user (the one writing)
  isPrimary (author: string): boolean {
    return author === this.active
  }

  // Show time nicely
  parseDate (date: Date): string {
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour12: true
    }
    return date.toLocaleString('es-ES', options)
  }
}
</script>
