/* eslint-disable no-unused-vars */
<template>
  <div class="zy-logo">
    <img :width="size" :src="setting.websiteInfo.logo || url||logo">
    <span v-if="showTitle" class="title">{{setting.websiteInfo.name || 'Admin'}}@{{ setting.websiteInfo.version || '1.0.0' }}</span>
  </div>
</template>

<script setup>

import logo from '@/assets/img/logo.png';
import setting from '@/setting.js';


// 定义可触发的事件



</script>

<style lang="scss" scoped>
.zy-logo {
  display: flex;
  justify-content: left;
  align-items: center;
  .title {
    font-weight: bold;
    margin-left: 12px;
    font-size: 1.3rem;
    font-family: "Baskerville Old Face";
  }
}
</style>
