<template>
  <div
    class="tip"
    :id="type">
    <div class="tip_header">
      <div class="icon"></div>
      <div class="title">{{ title }}</div>
    </div>

    <p
      v-if="content"
      v-html="content">
    </p>
    <p v-else>
      <slot />
    </p>
  </div>
</template>

<script setup>
  const props = defineProps({
    type: {
      type: String,
      default: 'Informational',
    },
    title: {
      type: String,
      default: '说明',
    },
    content: {
      type: String,
      default: '',
    },
  });
</script>
<style lang="less" scoped>
  .tip {
    display: flex;
    align-items: flex-start;
    margin: 16px 0;
    padding: 12px 16px;
    .tip_header {
      display: flex;
      align-items: center;
      min-width: fit-content;
      margin-right: 12px;
    }
    .icon {
      // ../../${type}.jpg
      background-position: 50%;
      background-repeat: no-repeat;
      background-size: 18px 18px;
      border: none;
      display: inline-block;
      height: 20px;
      margin-right: 8px;
      padding: 0;
      vertical-align: middle;
      width: 20px;
      transform: scale(0.9);
    }
    p {
      font-size: 14px;
    }
    .title {
      color: #181818;
      font-size: 14px;
      font-weight: 600;
    }
  }
  #error {
    background-color: #fef7f6;
    border-left: 2px solid #f15634;
    .icon {
      background-image: url('/error.jpg');
    }
  }
  #waring {
    background-color: #fff9f3;
    border-left: 2px solid #ffa400;
    .icon {
      background-image: url('/waring.jpg');
    }
  }
  #Informational {
    background-color: #f5f5f6;
    border-left: 2px solid #9bb9e9;
    .icon {
      background-image: url('/Informational.jpg') !important;
      background-size: cover;
    }
  }
</style>
