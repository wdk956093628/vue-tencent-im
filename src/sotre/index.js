import { createPinia } from 'pinia'
import { useChatStore } from './modules/chat'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const store = createPinia()

store.use(createPersistedState({
  auto: false
}))

// const useChatStore = useChatStore()

export default store