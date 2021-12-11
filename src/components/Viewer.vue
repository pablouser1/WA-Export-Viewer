<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a role="button" @click="showNav = !showNav" class="navbar-burger" :class="{ 'is-active': showNav }" aria-label="menu" aria-expanded="false">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" :class="{ 'is-active': showNav }">
      <div class="navbar-start">
        <!-- TODO ADD SEARCH -->
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="select">
            <select v-model="active">
              <option v-for="(participant, i) in participants" :key="'participant' + i" :value="participant">{{ participant }}</option>
            </select>
          </div>
        </div>
        <div class="navbar-item">
          <button @click="viewAll" class="button is-danger">Show all messages</button>
        </div>
        <div class="navbar-item">
          <button @click="reset" class="button is-danger">Choose another file</button>
        </div>
      </div>
    </div>
  </nav>
  <section id="wrapper" class="section">
    <div id="wa-container" class="wa-container">
      <div class="msg" v-for="(message, i) in viewedMessages" :key="'message' + i">
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
      const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight
      if (bottomOfWindow) {
        this.showMessages()
      }
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
