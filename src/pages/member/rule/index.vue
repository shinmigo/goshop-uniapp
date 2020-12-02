<template>
  <web-view :src="htmlUrl"></web-view>
</template>

<script>
  const app = getApp();
  const userResisterProtocol = 'http://10.32.5.88:8199/static/user_agreement.html'; //用户注册协议
  const privacyProtectionPolicy = 'http://10.32.5.88:8199/static/privacy_agreement.html'; //隐私权保护政策
  const prepaidCardUseInfo = 'http://10.32.5.88:8199/static/privacy_agreement.html'; //充值卡条款
  export default {
    data() {
      return {
        htmlUrl: '',
      }
    },
    onLoad(option) {
      switch (option.type) {
        case 'userResisterProtocol':
          this.htmlUrl = userResisterProtocol;
          break;
        case 'privacyProtectionPolicy':
          this.htmlUrl = privacyProtectionPolicy;
          break;
        case 'prepaidCardUseInfo':
          this.htmlUrl = prepaidCardUseInfo;
          break;
      }
      console.log(option.type, this.htmlUrl)
    }
  }
</script>

<style lang="scss">
  @import "./index.scss";
</style>
