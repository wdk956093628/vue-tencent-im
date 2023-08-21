<script setup>
import { getCurrentInstance, ref, onMounted, reactive, nextTick } from 'vue';
import TencentCloudChat from "@tencentcloud/chat"
const { proxy } = getCurrentInstance()
const chat = proxy.chat
const userId = ref('141355')
const userSig = ref('eJyrVgrxCdZLrSjILEpVsjI0NTU1MjAw0AGLlqUWKVkpGekZKEH4xSnZiQUFmSlAdSYGBqbmZqaGlhCZzJTUvJLMtEywBkMTQ2NTU5iezHSQGQbOHo755t6J6ZkRUYVB6UlFBk6h5sXOAWHe-qnGBe7e*SVVZmn*vj7u*bZQjSWZuSAHmVkaGVgam5sY1gIA*UIwYQ__')

const loginFlag = ref(false)

const inputMessgae = ref('')

const defaultAvatar = '../src/assets/images/user.png'

// 登录方法
const login = () => {
  const params = {
    userID: userId.value,
    userSig: userSig.value
  }
  chat.login(params).then((imRes) => {
    // 登录成功
    console.log('loginSuccess==============>>>>>>>>>>>>', imRes)
    loginFlag.value = true
    document.getElementsByClassName('hideEl')[0].scrollIntoView()
    if (imRes.data.repeatLogin === true) {
      // 标识账号已登录，本次登录操作为重复登录。
      console.log('重复登录==================>>>>>>>>>>>>', imRes.data.errorInfo);
    }
  })
}

// 创建消息
const createTextMessage = () => {
  const messgae = chat.createTextMessage({
    to: '141085',
    conversationType: TencentCloudChat.TYPES.CONV_C2C,
    payload: {
      text: inputMessgae.value
    }
  })
  return messgae
}

// 发送消息
const sendMessage = () => {
  const textMessage = createTextMessage()
  chat.sendMessage(textMessage).then(res => {
    historyMessageList.push(res.data.message)
    inputMessgae.value = ''
    scrollToBottom()
  })
}

const scrollToBottom = () => {
  nextTick(() => {
    const child = document.getElementById('chatContent')
    const h = document.getElementsByClassName('messageList')[0].offsetHeight
    // console.log(child.scrollHeight)
    console.log(h)
    // child.scrollTo(0, 1000)
    // child.scrollTo(0, currentScrollH - scrollH.value)
    // console.log(document.getElementsByClassName('hide')[0])
    // document.getElementsByClassName('hideEl')[0].scrollIntoView()
  })
}

// 接收消息
const onReceivedMessage = (event) => {
  const messgaeList = event.data
  messgaeList.forEach(messgae => {
    if (messgae.type === TencentCloudChat.TYPES.MSG_TEXT) {
      historyMessageList.push(messgae)
      scrollToBottom()
    }
  })
}

const historyMessageList = reactive([])
const nextReqMessageID = ref('')
const isCompleted = ref(false)
let count = ref(0)

// 获取历史消息
const getHistoryMessgae = () => {
  const options = {
    conversationID: 'C2C141085',
    nextReqMessageID: nextReqMessageID.value
  }
  if (!options.nextReqMessageID) {
    delete options.nextReqMessageID
  }
  chat.getMessageList(options).then(res => {
    console.log('历史消息=================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', res)
    nextReqMessageID.value = res.data.nextReqMessageID
    isCompleted.value = res.data.isCompleted
    if(count.value === 0) {
      historyMessageList.push(...res.data.messageList)
    } else {
      historyMessageList.unshift(...res.data.messageList)
    }
    nextTick(() => {
      // const child = document.getElementsByClassName('container')[0]
      // const currentScrollH = document.getElementById('chatContent').clientHeight
      // console.log('result', currentScrollH - scrollH.value)
      // console.log('currentScrollH', currentScrollH)
      // console.log('scrollH.value', scrollH.value)
      // scrollH.value = document.getElementById('chatContent').offsetHeight
      // document.getElementsByClassName('hide')[0].scrollIntoView()
    })
    count.value++
    scrollToBottom()
  })
}

const scroll = () => {
  const child = document.getElementsByClassName('container')[0]
  child.addEventListener('scroll', () => {
    const scrollTop = child.scrollTop
    if (scrollTop === 0 && !isCompleted.value) {
      getHistoryMessgae()
    }
  })
}

onMounted(() => {
  // login()
  chat.on(TencentCloudChat.EVENT.MESSAGE_RECEIVED, onReceivedMessage)
  // chat.on(TencentCloudChat.EVENT.SDK_READY, getHistoryMessgae)

  // scroll()
})
</script>

<template>
  <div class="container">
    <h2 class="header">vue im</h2>
    <div v-show="!loginFlag" class="loginBtn">
      <button @click="login">登录</button>
    </div>
    <div v-show="loginFlag" id="chatContent" class="chatContent">
      <div class="messageList">
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
          <p v-else-if="item.type === 'TIMCustomElem'" class="systemMessage">{{ item.payload.description }}</p>
        </div>
      </div>
      <div class="hideEl">hide</div>
      <div class="bottomInput">
        <input v-model="inputMessgae" type="text" />
        <button @click="sendMessage">send</button>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
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
  overflow: auto;
  background-color: rgb(245,245,245);
}

.messageList {
  width: 100%;
  height: 1000px;
  padding: 0 10px;
  box-sizing: border-box;
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
  display: none !important;
  padding: 10px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background-color: #FFFFFF;
}
.bottomInput > input {
  text-indent: 10px;
  width: 80%;
  height: 40px;
  box-sizing: border-box;
}
.bottomInput > button {
  flex: 1;
  margin-left: 10px;
  height: 40px;
}

.hideEl {
  height: 0;
}
</style>
