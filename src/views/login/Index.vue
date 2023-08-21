<template>
  <div class="container login">
    <img class="login-img" src="@/assets/images/login.png" alt="">
    <h1 class="login-title">Sign Up!</h1>
    <div class="login-content">
      <div class="input-box">
        <img class="input-icon" src="@/assets/images/username.png" alt="">
        <input class="input" type="text">
      </div>
      <div class="input-box">
        <img @click="switchPwdType" class="input-icon" src="@/assets/images/password.png" alt="">
        <input class="input" :type="login.pwdType">
      </div>
      <Transition name="fade">
        <div v-if="login.error" class="error-info">
          <p class="error-details">标识账号已登录，本次登录操作为重复登录。</p>
        </div>
      </Transition>
    </div>
    <div class="login-btn">
      <button @click="loginFun" class="button">SING IN</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, inject } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter()
const chat = inject('TencentChat')
const login = reactive({
  username: '',
  password: '',
  pwdType: 'password',
  error: '',
  userID: '141355',
  userSig: 'eJyrVgrxCdZLrSjILEpVsjI0NTU1MjAw0AGLlqUWKVkpGekZKEH4xSnZiQUFmSlAdSYGBqbmZqaGlhCZzJTUvJLMtEywBkMTQ2NTU5iezHSQGQbOHo755t6J6ZkRUYVB6UlFBk6h5sXOAWHe-qnGBe7e*SVVZmn*vj7u*bZQjSWZuSAHmVkaGVgam5sY1gIA*UIwYQ__'
})

const switchPwdType = () => {
  login.pwdType =  login.pwdType === 'password' ? 'text' : 'password'
}

// 登录方法
const loginFun = () => {
  const params = {
    userID: login.userID,
    userSig: login.userSig
  }
  chat.login(params).then((imRes) => {
    router.push('/chat')
    if (imRes.data.repeatLogin === true) {
      login.error = imRes.data.errorInfo
    }
  })
}

</script>

<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-img {
  width: 80%;
}
.login-title {
  font-size: 24px;
}

.login-content {
  position: relative;
  padding: 0 30px;
  margin-top: 30px;
  width: 100%;
}

.input-box {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  &::after {
    content: '';
    display: inline-block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0px;
    height: 1px;
    background-color: #ddd;
  }
  .input-icon {
    margin-right: 15px;
    width: auto;
    height: 22px;
  }
  .input {
    flex: 1;
    height: 40px;
    border: 0;
    font-size: 16px;
    color: #707070;
    letter-spacing: 1px;
  }
}

.login-btn {
  margin-top: 30px;
  padding: 0 30px;
  width: 100%;
  .button {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #000;
    font-size: 12px;
    font-weight: bold;
    border-radius: 20px;
    background-color: #CDD7FD;
    border: 1px solid #CDD7FD;
    &:hover {
      box-shadow: 0px 0px 15px #CDD7FD;
    }
  }
}

.error-info {
  display: inline-block;
  position: absolute;
  bottom: -10px;
  .error-details {
    color: #F98546;
    font-size: 12px;
  }
}
</style>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>