// https://vitepress.dev/guide/custom-theme
import { h, watch } from 'vue';
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import './style.css';
import NsImg from './component/nsImg.vue';
import nsTipBox from './component/nsTipBox.vue';
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app, router, siteData }) {
    const postUrlWithTimestamp = (url) => {
      const timestamp = new Date();

      // 构造消息
      const message = {
        type: 'urlChange',
        url,
        timestamp,
      };

      // 发送消息给父级窗口
         window.parent.postMessage(message, '*'); // 可替换 '*' 为特定的域名以提高安全性
     };


    // 监听路由变化
    watch(
      () => router.route.path,
      (newPath, oldPath) => {
        if (newPath !== oldPath) {
          postUrlWithTimestamp(newPath);
        }
      }
    );
    app.component('NsImg',NsImg);
    app.component('nsTipBox',nsTipBox)
  },
} satisfies Theme;
