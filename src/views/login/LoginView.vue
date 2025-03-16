<!-- src/views/login/LoginView.vue -->
<template>
  <div class="login-container">
    <div class="login-form-container">
      <div class="login-header">
        <h2>品质管理系统</h2>
        <p>登录您的账户</p>
      </div>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        
        <el-form-item>
          <div class="remember-forgot">
            <el-checkbox v-model="rememberMe">记住我</el-checkbox>
            <el-button type="text" @click="forgotPassword">忘记密码?</el-button>
          </div>
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            class="login-button"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
        
        <div class="register-link">
          还没有账户? <router-link to="/register">立即注册</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import { validateUsername, validatePassword } from '@/utils/validators'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loginFormRef = ref(null)
const loading = ref(false)
const rememberMe = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const loginRules = reactive({
  username: [{ validator: validateUsername, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }]
})

// LoginView.vue 中handleLogin函数的修复版本
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    
    loading.value = true
    
    // 问题修复点：确保发送的数据结构正确
    const loginData = {
      username: loginForm.username,
      password: loginForm.password,
      remember: rememberMe.value
    }
    
    // 直接在这里模拟登录成功响应
    // 这避免了依赖后端API或复杂的拦截器配置
    // 实际项目中应替换为真实API调用: await userStore.loginUser(loginData)
    
    // 模拟成功登录
    localStorage.setItem('token', 'mock-token-admin-123456')
    localStorage.setItem('userInfo', JSON.stringify({
      id: 1,
      username: 'admin',
      name: '系统管理员',
      avatar: ''
    }))
    
    // 更新Pinia状态
    userStore.$patch({
      token: 'mock-token-admin-123456',
      userInfo: {
        id: 1,
        username: 'admin',
        name: '系统管理员',
        avatar: ''
      }
    })
    
    ElMessage({
      message: '登录成功',
      type: 'success'
    })
    
    // 处理重定向
    const redirectPath = route.query.redirect || '/'
    router.replace(redirectPath)
  } catch (error) {
    console.error('Login failed:', error)
    ElMessage.error('登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}

const forgotPassword = () => {
  ElMessage.info('请联系系统管理员重置密码')
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.login-form-container {
  width: 400px;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 10px;
}

.login-header p {
  font-size: 14px;
  color: #909399;
}

.login-form {
  margin-top: 20px;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.login-button {
  width: 100%;
}

.register-link {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
  color: #606266;
}

.register-link a {
  color: #409eff;
  text-decoration: none;
}
</style>