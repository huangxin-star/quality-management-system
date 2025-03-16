<!-- src/views/layout/MainLayout.vue -->
<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="layout-aside">
      <div class="logo-container">
        <img src="@/assets/msi.png" alt="Logo" class="logo-image" v-if="!isCollapse"/>
        <img src="@/assets/msi.png" alt="Logo" class="logo-small" v-else/>
        <p>msi品质管理系统</p>
      </div>

      <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          :collapse="isCollapse"
          background-color="#001529"
          text-color="#b3b3b3"
          active-text-color="#ffffff"
          router
      >
        <el-menu-item index="/">
          <el-icon>
            <DataBoard/>
          </el-icon>
          <template #title>仪表盘</template>
        </el-menu-item>
                <el-menu-item index="/meeting">

                  <template #title>会议记录</template>
                </el-menu-item>

        <el-sub-menu index="/proposal">
          <template #title>
            <el-icon>
              <Document/>
            </el-icon>
            <span>提案管理</span>
          </template>
          <el-menu-item index="/proposal/submit">
            <el-icon>
              <Edit/>
            </el-icon>
            <span>新建提案</span>
          </el-menu-item>
          <el-menu-item index="/proposal/analyze">
            <el-icon>
              <DataAnalysis/>
            </el-icon>
            <span>分析提案</span>
          </el-menu-item>
          <el-menu-item index="/proposal/history">
            <el-icon>
              <HistoryIcon/>
            </el-icon>
            <span>历史提案</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/settings">
          <template #title>
            <el-icon>
              <Setting/>
            </el-icon>
            <span>系统设置</span>
          </template>
          <el-menu-item index="/settings/profile">
            <el-icon>
              <User/>
            </el-icon>
            <span>个人信息</span>
          </el-menu-item>
          <el-menu-item index="/settings/security">
            <el-icon>
              <Lock/>
            </el-icon>
            <span>安全设置</span>
          </el-menu-item>
        </el-sub-menu>

      </el-menu>

      <div class="collapse-button">
        <el-button
            type="text"
            @click="toggleCollapse"
            :icon="isCollapse ? 'Expand' : 'Fold'"
        />
      </div>
    </el-aside>

    <!-- 内容区域 -->
    <el-container class="layout-main">
      <!-- 顶部导航 -->
      <el-header class="layout-header">
        <div class="header-left">
          <breadcrumb/>
        </div>

        <div class="header-right">
          <el-tooltip content="全屏" placement="bottom">
            <el-button
                type="text"
                :icon="isFullscreen ? 'Close' : 'FullScreen'"
                @click="toggleFullScreen"
            />
          </el-tooltip>

          <el-dropdown trigger="click" @command="handleCommand">
            <div class="avatar-container">
              <!-- <el-avatar :size="32" :src="userInfo.avatar || defaultAvatar" /> -->
              <span class="username">{{ userInfo.username }}</span>
              <el-icon>
                <ArrowDown/>
              </el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="settings">账户设置</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 页面内容 -->
      <el-main class="layout-content">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component"/>
          </transition>
        </router-view>
      </el-main>

      <!-- 页脚 -->
      <el-footer class="layout-footer">
        <div class="footer-content">
          品质管理系统 &copy; {{ currentYear }} 版权所有
        </div>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {ElMessageBox} from 'element-plus'
import {useUserStore} from '@/store/user'
import Breadcrumb from '@/components/Breadcrumb.vue'
import MeetingRecords from "../meeting/MeetingRecords.vue";
//import defaultAvatar from '@/assets/default-avatar.png'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const isCollapse = ref(false)
const isFullscreen = ref(false)
const currentYear = ref(new Date().getFullYear())

// 计算当前活跃菜单
const activeMenu = computed(() => {
  return route.path
})

// 获取用户信息
const userInfo = computed(() => {
  return userStore.userInfo
})

onMounted(() => {
  // 如有必要，请求最新的用户信息
  if (Object.keys(userStore.userInfo).length === 0) {
    userStore.fetchUserInfo()
  }
})

// 切换侧边栏收起状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 切换全屏
const toggleFullScreen = () => {
  const element = document.documentElement

  if (!isFullscreen.value) {
    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen()
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen()
    }
    isFullscreen.value = true
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
    isFullscreen.value = false
  }
}

// 处理用户菜单命令
const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/settings/profile')
      break
    case 'settings':
      router.push('/settings/security')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 处理登出
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await userStore.logoutUser()
    router.push('/login')
  }).catch(() => {
    // 取消操作
  })
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  width: 100%;
}

.layout-aside {
  display: flex;
  flex-direction: column;
  background-color: #001529;
  transition: width 0.3s;
  overflow: hidden;
}

.logo-container {
  height: 60px;
  display: flex;
  flex-direction: column; /* 设置为纵向排列 */
  justify-content: center;
  align-items: center;
  padding: 65px 0;
}

.logo-container p {
  color: white;
}

.logo-image {
  height: 40px;
}

.logo-small {
  height: 32px;
}

.sidebar-menu {
  border-right: none;
  flex: 1;
}

.collapse-button {
  margin: 10px 0;
  text-align: center;
}

.layout-main {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.layout-header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-right {
  display: flex;
  align-items: center;
}

.avatar-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 20px;
}

.username {
  margin: 0 5px;
  font-size: 14px;
}

.layout-content {
  background-color: #f5f7fa;
  overflow: auto;
  padding: 20px;
}

.layout-footer {
  background-color: #f5f7fa;
  border-top: 1px solid #e6e6e6;
  color: #909399;
  text-align: center;
  font-size: 14px;
  padding: 15px 0;
}

/* 过渡动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>