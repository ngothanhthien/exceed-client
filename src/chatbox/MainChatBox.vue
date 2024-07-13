<script setup>
import { useChatStore } from '@/chatbox/ChatStore.js'
import IconChat from '@/icon/chat.vue'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { socket } from '@/socket.js'
import { EVENT_NAME } from '@/chatbox/constants.js'

const chatStore = useChatStore()
chatStore.bindEvents()
onUnmounted(() => {
  chatStore.cleanup()
})
onMounted(async () => {
  setTimeout(() => {
    scrollToBottom()
  }, 100)
})

const typingMessage = ref('')
const viewBox = ref(null)
async function sendMessage() {
  chatStore.create(typingMessage.value)
  typingMessage.value = ''
  await nextTick()
  scrollToBottom()
}

socket.on(EVENT_NAME.CHAT_CREATED, async () => {
  await nextTick()
  scrollToBottom()
})

const isExpanded = ref(true)
const typingBox = ref(null)
watch(isExpanded, async (newValue) => {
  typingMessage.value = ''
  if (newValue) {
    await nextTick()
    typingBox.value.focus()
    scrollToBottom()
  }
})

function scrollToBottom() {
  viewBox.value.scrollTop = viewBox.value.scrollHeight
}
</script>

<template>
  <div>
    <div class="w-96 h-96 relative">
      <icon-chat class="w-10 h-10 absolute fill-white right-2" :class="{ 'fill-gray-900/80': !isExpanded }" @click="isExpanded = !isExpanded" />
      <template v-if="isExpanded">
        <div ref="viewBox" class="viewBox-scrollbar px-2 py-2 h-full overflow-y-auto rounded-t-md bg-gray-900/90 text-yellow-200">
          <div v-for="message in chatStore.messages">
            {{ message }}
          </div>
        </div>
        <div class="w-full">
          <input v-model="typingMessage" ref="typingBox" type="text" class="w-full px-3 py-1.5 rounded-b-md border border-gray-900/80 focus:outline-none" @keyup.enter="sendMessage" />
        </div>
      </template>
    </div>
  </div>
</template>
<style>
.viewBox-scrollbar::-webkit-scrollbar {
  width: 8px; /* Width of the scrollbar */
}

.viewBox-scrollbar::-webkit-scrollbar-track {
  background: #2d3748; /* Color of the track (part the thumb slides within) */
}

.viewBox-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e0; /* Color of the scrollbar thumb */
  border-radius: 20px; /* Rounded corners of the scrollbar thumb */
  border: 3px solid #2d3748; /* Creates a border around the thumb with the track color */
}

.viewBox-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #b2bec3; /* Color of the scrollbar thumb on hover */
}
</style>
