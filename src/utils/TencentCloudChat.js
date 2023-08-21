import TencentCloudChat from "@tencentcloud/chat"
import TIMUploadPlugin from "tim-upload-plugin"
import TIMProfanityFilterPlugin from "tim-profanity-filter-plugin"

const options = {
  SDKAppID: 1400576519 // SDKAppID
}

const chat = TencentCloudChat.create(options)

// chat.setLogLevel(0) // 普通级别，日志量较多，接入时建议使用
chat.setLogLevel(1) // release 级别，SDK 输出关键信息，生产环境时建议使用

// 注册腾讯云即时通信 IM 上传插件
chat.registerPlugin({'tim-upload-plugin': TIMUploadPlugin})

// 注册腾讯云即时通信 IM 本地审核插件
chat.registerPlugin({'tim-profanity-filter-plugin': TIMProfanityFilterPlugin})

export default chat