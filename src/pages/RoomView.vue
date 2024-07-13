<script setup>
import { useRoomStore } from '@/stores/RoomStore.js'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import router from '@/router.js'

const room = useRoomStore()
room.bindEvents()
onUnmounted(() => {
  room.cleanUp()
})
/**
 * @type {import('vue').ComputedRef<Room>}
 */
const info = computed(() => room.current)
const accounts = computed(() => info.value?.accounts)
const inviteButton = ref(null)
function generateInviteLink() {
  const domain = window.location.origin
  navigator.clipboard.writeText(`${domain}?invite=${info.value?.id}`)
  inviteButton.value.innerText = 'Copied!'
  setTimeout(() => {
    inviteButton.value.innerText = 'Invite'
  }, 2000)
}

const loading = ref(false)
onMounted(async () => {
  if (info.value === null) {
    loading.value = true
    await room.fetchCurrent()
    loading.value = false
    if (!room.current) {
      await router.push('/')
    }
  }
})

function isOwner(account) {
  return account.id === info.value.owner_id
}
</script>

<template>
  <template v-if="!loading">
    <div class="flex justify-space-between">
      <h1 class="margin-none">Room #{{ info?.id }}</h1>
      <button ref="inviteButton" @click="generateInviteLink">Invite</button>
    </div>
    <div>
      <div>
        <div
          v-for="account in accounts" :key="account.id"
          class="alert alert-primary flex items-center"
          :class="{'py-2': isOwner(account)}"
        >
          <div class="mr-2">
            {{ account.name }}
          </div>
          <div class="pb-2">
            <span v-if="isOwner(account)" class="badge success">Owner</span>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>
