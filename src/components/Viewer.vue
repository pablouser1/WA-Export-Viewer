<template>
  <section id="wrapper" class="section">
    <div class="columns is-mobile is-vcentered is-multiline">
      <div class="column is-narrow">
        <div class="field has-addons">
          <div class="control">
            <input v-model="date" class="input" type="date" />
          </div>
          <div class="control">
            <button @click="searchByDate" class="button is-info">Search</button>
          </div>
        </div>
      </div>
      <div class="column is-narrow">
        <div class="field">
          <label class="label">Participants</label>
          <div class="control">
            <div class="select">
              <select v-model="active">
                <option v-for="(participant, i) in participants" :key="'participant' + i" :value="participant">{{ participant }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-narrow">
        <button @click="viewAll" class="button is-danger">Show all messages</button>
      </div>
    </div>
    <hr />
    <div id="wa-container" class="wa-container">
      <div class="msg" :id="'message' + i" v-for="(message, i) in viewedMessages" :key="'message' + i">
        <div class="bubble" :class="{ alt: isPrimary(message.author) && !isChained(i), follow: isChained(i) && !isPrimary(message.author), altfollow: isPrimary(message.author) && isChained(i) }">
          <div class="txt">
            <p class="name" v-if="!isChained(i)">{{ message.author }}</p>
            <span class="timestamp">{{ parseDate(message.date) }}</span>
            <p class="message" v-bind:class="{follow: isChained(i)}">{{ message.message }}</p>
          </div>
          <div v-if="!isChained(i)" class="bubble-arrow" v-bind:class="{alt: isPrimary(message.author) }"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component'
import { Message } from 'whatsapp-chat-parser/types/types'

@Options({
  props: {
    totalMessages: Array
  },
  emits: ['reset']
})
export default class Viewer extends Vue {
  totalMessages: Message[] = []
  viewedMessages: Message[] = []
  participants: string[] = []
  active = ''
  count = 0
  showNav = false
  date = ''

  reset (): void {
    this.$emit('reset')
  }

  showMessages (num = -1): void {
    // num = index of message
    if (num === -1) {
      this.count += 30
    } else {
      this.count = num
    }

    if (this.count > this.totalMessages.length) {
      this.count = this.totalMessages.length
    }
    this.viewedMessages = this.totalMessages.slice(0, this.count)
  }

  setParticipants (): void {
    this.totalMessages.map(message => {
      if (!this.participants.includes(message.author) && message.author !== 'System') {
        this.participants.push(message.author)
      }
    })
  }

  // Check if last message was also made by the same author
  isChained (index: number): boolean {
    const last = index - 1
    return last >= 0 && this.viewedMessages[index].author === this.viewedMessages[last].author
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
      day: 'numeric'
    }
    const userLang = navigator.language
    return date.toLocaleString(userLang, options)
  }

  viewAll (): void {
    this.viewedMessages = this.totalMessages
  }

  scroll (): void {
    window.onscroll = () => {
      const bottomOfWindow = window.scrollY + window.innerHeight >= document.body.offsetHeight - 1000
      if (bottomOfWindow) {
        this.showMessages()
      }
    }
  }

  searchByDate (): void {
    const messageIndex = this.totalMessages.findIndex(message => {
      return message.date.toDateString() === new Date(this.date).toDateString()
    })
    if (messageIndex !== -1) {
      if (!document.getElementById(`message${messageIndex}`)) {
        // Render all messages until reaching the message found + 30
        this.showMessages(messageIndex + 30)
      }
      this.$nextTick(() => this.scrollToMessage(messageIndex))
    } else {
      alert('No message found')
    }
  }

  scrollToMessage (index: number): void {
    const msg = document.getElementById(`message${index}`)
    if (msg) {
      console.log(`Scrolling to message ${index}`)
      msg.scrollIntoView({
        behavior: 'smooth'
      })
    } else {
      console.error(`Message ${index} does not exist`)
    }
  }

  mounted (): void {
    this.showMessages()
    this.setParticipants()
    this.active = this.participants[0]
    this.scroll()
  }

  unmounted (): void {
    window.onscroll = null
  }
}
</script>
