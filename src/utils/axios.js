// src/utils/axios.js
import axios from "axios";
import router from "@/router";
import { ElMessage } from "element-plus";

// 创建axios实例
const service = axios.create({
  baseURL: "/api",
  timeout: 15000,
});

// 在请求拦截器中添加模拟响应
service.interceptors.request.use(
  config => {
    // 模拟登录API
    if (config.url === '/auth/login' && config.method === 'post') {
      const { username, password } = config.data;
      
      // 验证测试账号
      if (username === 'admin' && password === '123456') {
        return Promise.resolve({
          data: {
            code: 200,
            data: {
              token: 'mock-token-12345',
              userInfo: {
                id: 1,
                username: 'admin',
                name: '管理员',
                role: 'admin'
              }
            },
            message: '登录成功'
          }
        });
      } else {
        return Promise.reject(new Error('用户名或密码错误'));
      }
    }
    
    // 继续处理其他API请求
    return config;
  },
  error => Promise.reject(error)
);  

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;

    // 根据业务逻辑处理响应
    if (res.code && res.code !== 200) {
      ElMessage({
        message: res.message || "Error",
        type: "error",
        duration: 5 * 1000,
      });

      // 401: 未授权
      if (res.code === 401) {
        // 清除本地存储的token并跳转到登录页
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        router.push("/login");
      }

      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return response.data;
    }
  },
  (error) => {
    console.error("Response error:", error);
    ElMessage({
      message: error.message || "Request failed",
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
