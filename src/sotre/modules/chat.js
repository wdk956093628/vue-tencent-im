import { defineStore } from 'pinia'
import chat from '@/utils/TencentCloudChat'
import TencentCloudChat from "@tencentcloud/chat"

export const useChatStore = defineStore('useChatStore', {
  state: () => ({
    conversationID: 'C2C141085',
    nextReqMessageID: null,
    historyMessageList: [],
    isCompleted: false
  }),
  getters: {
    getHistoryMessageList() {
      return this.historyMessageList
    }
  },
  actions: {
    // 获取历史消息
    onHistoryMessageList() {
      return new Promise((resolve, reject) => {
        const options = {
          conversationID: this.conversationID,
          nextReqMessageID: this.nextReqMessageID
        }
        if (!options.nextReqMessageID) {
          delete options.nextReqMessageID
        }
        chat.getMessageList(options).then(res => {
          this.nextReqMessageID = res.data.nextReqMessageID
          this.isCompleted = res.data.isCompleted
          this.historyMessageList.unshift(...res.data.messageList)
          resolve()
        }).catch((err) => {
          reject(err)
        })
      })
    },
    // 接收消息
    onReceivedMessage(event) {
      const messgaeList = event.data
      messgaeList.forEach(messgae => {
        if (messgae.type === TencentCloudChat.TYPES.MSG_TEXT) {
          this.historyMessageList.push(messgae)
        }
      })
    },
    // 发送消息
    SEND_MESSAGE() {
      const textMessage = createTextMessage()
      chat.sendMessage(textMessage).then(res => {
        this.historyMessageList.push(res.data.message)
      })
    }
  }
})