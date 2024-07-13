<script setup>
import { useGlobalAccountsStore } from '@/stores/GlobalAccountsStore.js'
import { useAccountStore } from '@/stores/AccountStore.js'
import { useRoomStore } from '@/stores/RoomStore.js'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, onUnmounted } from 'vue'
import router from '@/router.js'

const globalAccount = useGlobalAccountsStore()
globalAccount.bindEvents()

const account = useAccountStore()

const room = useRoomStore()
room.bindEvents()

onUnmounted(() => {
  room.cleanUp()
  globalAccount.cleanUp()
  account.cleanUp()
})
/**
 * @type {import('vue').ComputedRef<Room>}
 */
const roomInfo = computed(() => room.current)

async function createRoom() {
  if (await room.create()) {
    await router.push('/room')
  }
}
const route = useRoute()
onMounted(async () => {
  await account.bindEvents()
  /*
    * invite: string | undefined - RoomId
   */
  const { invite } = route.query
  if (invite !== undefined) {
    if (await room.join(invite)) {
      await router.push('/room')
    }
  }
})
</script>

<template>
  <h1 class="margin-none">Home</h1>
  <div>
    <div>
      <div class="row">
        <div class="col-6 col">
          <button v-if="!roomInfo" @click="createRoom" class="btn-block">Create room</button>
          <button v-else @click="router.push('/room')">Continue Room#{{ roomInfo.id }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
