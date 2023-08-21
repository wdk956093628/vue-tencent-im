const Home = () => import('@/views/login/Index.vue')
const Login = () => import('@/views/login/Index.vue')
const Chat = () => import('@/views/chat/Index.vue')
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/chat',
    name: 'chat',
    component: Chat
  }
]

export default routes