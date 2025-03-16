<!--
 * @Author: huangxin-star 458629403@qq.com
 * @Date: 2025-03-15 21:53:09
 * @LastEditors: huangxin-star 458629403@qq.com
 * @LastEditTime: 2025-03-15 21:53:28
 * @FilePath: /quality-management-system/src/components/Breadcrumb.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!-- src/components/Breadcrumb.vue -->
<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      v-for="(item, index) in breadcrumbs"
      :key="index"
      :to="item.path"
    >
      {{ item.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const breadcrumbs = ref([]);

const getBreadcrumbs = (route) => {
  const result = [];

  // 首页
  result.push({
    path: "/",
    title: "首页",
  });

  // 当前路由层级
  let matched = route.matched.filter((item) => item.meta && item.meta.title);

  matched.forEach((item) => {
    result.push({
      path: item.path,
      title: item.meta.title,
    });
  });

  return result;
};

// 监听路由变化
watch(
  () => route.path,
  () => {
    breadcrumbs.value = getBreadcrumbs(route);
  },
  { immediate: true }
);
</script>
