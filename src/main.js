/*
 * @Author: huangxin-star 458629403@qq.com
 * @Date: 2025-03-15 21:27:41
 * @LastEditors: huangxin-star 458629403@qq.com
 * @LastEditTime: 2025-03-15 22:42:37
 * @FilePath: /quality-management-system/src/main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./styles/main.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(router).use(createPinia()).use(ElementPlus).mount("#app");
