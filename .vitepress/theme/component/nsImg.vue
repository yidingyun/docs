<template>
  <ConfigProvider
    :locale="{
      Image: {
        preview: '预览',
      },
    }">
    <Image
      :src="`/nervui-ai-help${src}`"
      placeholder
      @click="imgClick"
      :preview="preview"
  /></ConfigProvider>
</template>

<script setup>
  import { ConfigProvider, Image } from 'ant-design-vue';
  import { onMounted, ref } from 'vue';
  const props = defineProps(['src']);
  const preview =  ref(false);
  onMounted(()=>{
    preview.value = !window.parent
  })

  const imgClick= ()=>{
    if(!preview.value){
      window.parent.postMessage({
        type: 'previewImg',
        url: `${window.location.origin}/nervui-ai-help${props.src}`
      }, '*')
    }

  }

</script>
