<template>
  <div v-show="getShow">
    <h2 class="login-title">Login</h2>
    <a-form
        loading
        :model="state.formState"
        name="normal_login"
        class="login-form"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
    >
      <a-form-item
          name="username"
          :rules="[{ required: true, message: 'please input username!' }]"
      >
        <a-input v-model:value="state.formState.username" allowClear autocomplete="off" size="large"
                 placeholder="username">
          <template #prefix>
            <IconFont type="icon-yonghuming" style="font-size: 18px"/>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
          name="password"
          :rules="[{ required: true, message: 'please input password!' }]"
      >
        <a-input-password v-model:value="state.formState.password" allowClear autocomplete="off" placeholder="password"
                          size="large">
          <template #prefix>
            <IconFont type="icon-mima" style="font-size: 18px"/>
          </template>
        </a-input-password>
      </a-form-item>
     
      <a-form-item>
        <a-form-item name="remember" no-style>
          <a-checkbox v-model:checked="state.formState.remember">Remmber password</a-checkbox>
        </a-form-item>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" style="width: 100%" :disabled="disabled" html-type="submit" size="large"
                  class="login-form-button">
          Login
        </a-button>
      </a-form-item>
    </a-form>
    <div>
      <a-space class="login-btn-list">
        <a-button @click="setLoginState('register')" disabled class="login-form-button">
          Register
        </a-button>
      
      </a-space>
    </div>
  
    <div class="other-login-type">
      <!-- <IconFont class="type-item" type="icon-github"/>
      <IconFont class="type-item" type="icon-gitee"/> -->
      <IconFont class="type-item" type="icon-weixin"/>
      <!-- <IconFont class="type-item" type="icon-weibo"/>
      <IconFont class="type-item" type="icon-qq"/> -->
    </div>
  </div>
</template>

<script setup>
import {reactive, computed} from 'vue';


import {useAuthStore} from '../../../stores/auth.js';
import {useLoginState} from '@/hooks/sys/useLogin.js';


const authStore = useAuthStore()
const {setLoginState, getLoginState} = useLoginState();
const getShow = computed(() => {
  return getLoginState.value === 'login'
});


const state = reactive({
  formState: {
    username: 'yzh',
    password: '123456',
  },
  captchaSvg: ''
})



const setOtherUser = () => {
  state.formState.username = 'test'
}

const onFinish = values => {
  authStore.login(values).then(res => {
    console.log(res)
  }).catch(err => {
    console.log(err)
   
  })
};
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};
const disabled = computed(() => {
  return !(state.formState.username && state.formState.password);
});



</script>

<style lang="scss" scoped>
.login-title {
  margin-bottom: 30px;
}

.hr {
  font-size: .9rem;
  color: #575656;
}

.login-form {
  max-width: 400px;
  background-color: #fff;
  overflow: hidden;

  .login-code {
    cursor: pointer;
  }
}

.login-btn-list {
  display: flex;
  flex-wrap: wrap;
}

.other-login-type {
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 22px;

  .type-item {
    cursor: pointer;

    
  }
}
</style>
