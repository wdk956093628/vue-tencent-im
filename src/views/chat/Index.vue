<template>
    <div id="chatContent" class="chatContent">
      <Transition name="fade">
        <div v-show="loading" class="loadingIcon">
          <svg-icon class="icon" name="loading"/>
        </div>
      </Transition>
      <div class="messageList" ref="messageListEl">
        <div class="messageItem" v-for="item in historyMessageList" :key="item.ID">
          <template v-if="item.type === 'TIMTextElem'">
            <div className="triangle"></div>
            <div v-if="item.flow === 'in'" class="messageReceive userMessage">
              <img class="avatar" :src="item.avatar || defaultAvatar" alt="avatar" />
              <p class="message">{{ item.payload.text }}</p>
            </div>
            <div v-else class="messageSend userMessage">
              <p class="message">{{ item.payload.text }}</p>
              <img class="avatar" :src="item.avatar || defaultAvatar" alt="avatar" />
            </div>
          </template>
          <template v-else-if="item.type === 'TIMCustomElem'">
            <p v-if="item.payload.description" class="systemMessage">{{ item.payload.description }}</p>
            <p v-else-if="item.payload.data === 'orderStatus' && item.payload.extension === '4'" class="systemMessage">{{ '审核失败' }}</p>
            <p v-else-if="item.payload.data === 'serviceEnd'" class="systemMessage">{{ '服务已结束' }}</p>
          </template>
        </div>
      </div>
      <!-- <div class="hideEl">hide</div> -->
      <div class="bottomInput">
        <input v-model="chatData.inputMessgae" type="text" />
        <button @click="setBottom">send</button>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, nextTick, inject, onUpdated } from 'vue';
import { useChatStore } from '@/sotre/modules/chat.js'
import { useUserStore } from '@/sotre/modules/user.js'
import TencentCloudChat from "@tencentcloud/chat"
import { debounce } from '@/utils/utils'
const { historyMessageList, isCompleted, onHistoryMessageList, SEND_MESSAGE } = useChatStore();
const { defaultAvatar } = useUserStore()
const chat = inject('TencentChat')
const chatData = reactive({
  inputMessgae: ''
})
const loading = ref(false)
const messageListEl = ref(null)

onMounted(() => {
  messageListEl.value.addEventListener("scroll", (e) => {
    debounce(hadnleScroll(e))
  })
  // setBottom()
})

// onUpdated(() => {
//   setBottom()
// })

// 滚动到底部事件
const setBottom = () => {
  nextTick(() => {
    messageListEl.value.scrollTop = messageListEl.value.scrollHeight
  })
}

const keepScroll = () => {
  nextTick(() => {
    messageListEl.value.scrollTop = messageListEl.value.scrollHeight - lastScrollHeight.value
  })
}

const lastScrollHeight = ref(0)
// 监听滚动事件
const hadnleScroll = (e) => {
  let scrollTop = e.target.scrollTop
  const scrollH = e.target.scrollHeight
  lastScrollHeight.value = scrollH
  if (scrollTop === 0 && !isCompleted) {
    loading.value = true
    onHistoryMessageList().then(() => {
      keepScroll()
    }).finally(()=> {
      loading.value = false
    })
  }
}

// 发送消息
const sendMessage = () => {
  const textMessage = createTextMessage()
  SEND_MESSAGE(textMessage)
}

// 创建消息
const createTextMessage = () => {
  const messgae = chat.createTextMessage({
    to: '141085',
    conversationType: TencentCloudChat.TYPES.CONV_C2C,
    payload: {
      text: chatData.inputMessgae
    }
  })
  return messgae
}


</script>

<style lang="scss" scoped>
.header {
  margin: 0;
  width: 100%;
  height: 60px;
  text-align: center;
  line-height: 60px;
  background-color: #FFFFFF;
  z-index: 2;
}
.loginBtn {
  margin-top: 80px;
  text-align: center;
}

.loginBtn button {
  width: 100px;
  height: 40px;
  background-color: #80D740;
  border-radius: 4px;
}

.chatContent {
  height: calc(100% - 60px);
  // overflow: auto;
  background-color: rgb(245,245,245);
}

.messageList {
  width: 100%;
  height: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  overflow: auto;
}

.systemMessage {
  margin: 20px 0;
  color: #999;
  text-align: center;
  font-size: 14px;
}

.userMessage {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.messageSend {
  justify-content: flex-end;
}

.message {
  position: relative;
  padding: 6px 10px;
  border-radius: 4px;
  max-width: 70%;
  word-break: break-word;
  white-space: pre-wrap;
}

.messageSend .message {
  margin-right: 8px;
  background-color: #80D740;
}

.messageReceive .message {
  margin-left: 8px;
  background-color: #FFFFFF;
}
.avatar {
  width: 45px;
}

.messageReceive .message::before {
  margin: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: -12px;
  content: '';
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-right: 6px solid #FFFFFF;
  border-bottom: 6px solid transparent;
  border-left: 6px solid transparent;
}
.messageSend .message::before {
  margin: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  right: -12px;
  content: '';
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-left: 6px solid #80D740;
  border-bottom: 6px solid transparent;
  border-right: 6px solid transparent;
}

.bottomInput {
  // display: none !important;
  padding: 10px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background-color: #ddd;
}
.bottomInput > input {
  text-indent: 10px;
  width: 75%;
  height: 40px;
  background-color: #FFFFFF;
  box-sizing: border-box;
}
.bottomInput > button {
  flex: 1;
  margin-left: 10px;
  background-color: #CDD7FD;
  height: 40px;
}

.hideEl {
  height: 0;
}

.loadingIcon {
  text-align: center;
}

.icon {
  display: inline-block;
  animation: move 1.2s linear infinite;
  -webkit-animation: move 1.2s linear infinite;
}
@keyframes move {
  100% {
      transform: rotate(360deg);
  }
}
</style>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>