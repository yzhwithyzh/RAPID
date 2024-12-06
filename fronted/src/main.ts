import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import {createPinia} from 'pinia';
import Antd from 'ant-design-vue';
import {createFromIconfontCN} from '@ant-design/icons-vue';
//import "ant-design-vue/dist/antd.variable.min.css";
//import Vueform from '@vueform/vueform'
//import vueformConfig from './../vueform.config'
//import './assets/main.scss'; // 引入 main.scss
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// 使用 Pinia



import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router).use(ElementPlus).use(createPinia()).use(Antd).mount('#app');