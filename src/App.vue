<template>
  <router-view></router-view>
</template>

<script setup>
import { onMounted, inject } from 'vue'
import TencentCloudChat from "@tencentcloud/chat"
import { useChatStore } from '@/sotre/modules/chat.js'
const { onHistoryMessageList, onReceivedMessage } = useChatStore()
const chat = inject('TencentChat')
onMounted(() => {
  chat.on(TencentCloudChat.EVENT.SDK_READY, onHistoryMessageList)
  chat.on(TencentCloudChat.EVENT.MESSAGE_RECEIVED, onReceivedMessage)
})
</script>

<style lang="" scoped>

</style>