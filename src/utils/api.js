// src/utils/api.js
import request from "./axios";

// 用户相关API
export function login(data) {
  return request({
    url: "/auth/login",
    method: "post",
    data,
  });
}

export function register(data) {
  return request({
    url: "/auth/register",
    method: "post",
    data,
  });
}

export function getUserInfo() {
  return request({
    url: "/user/info",
    method: "get",
  });
}

export function logout() {
  return request({
    url: "/auth/logout",
    method: "post",
  });
}

// 提案相关API
export function getProposals(params) {
  return request({
    url: "/proposals",
    method: "get",
    params,
  });
}

export function getProposalById(id) {
  return request({
    url: `/proposals/${id}`,
    method: "get",
  });
}

export function createProposal(data) {
  return request({
    url: "/proposals",
    method: "post",
    data,
  });
}

export function updateProposal(id, data) {
  return request({
    url: `/proposals/${id}`,
    method: "put",
    data,
  });
}

export function deleteProposal(id) {
  return request({
    url: `/proposals/${id}`,
    method: "delete",
  });
}

export function getProposalAnalytics(params) {
  return request({
    url: "/proposals/analytics",
    method: "get",
    params,
  });
}

// src/utils/validators.js
// 表单验证规则

export const validateUsername = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入用户名"));
  } else if (!/^[a-zA-Z0-9_-]{4,16}$/.test(value)) {
    callback(new Error("用户名应为4-16位字母、数字、下划线或连字符"));
  } else {
    callback();
  }
};

export const validatePassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入密码"));
  } else if (value.length < 6) {
    callback(new Error("密码长度不能小于6位"));
  } else {
    callback();
  }
};

export const validateEmail = (rule, value, callback) => {
  const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  if (!value) {
    callback(new Error("请输入邮箱地址"));
  } else if (!emailRegex.test(value)) {
    callback(new Error("请输入正确的邮箱地址"));
  } else {
    callback();
  }
};

// src/utils/formatters.js
// 日期和数据格式化工具

export function formatDate(date, format = "YYYY-MM-DD") {
  if (!date) return "";

  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return format
    .replace("YYYY", year)
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
}

export function formatNumber(num, decimals = 2) {
  if (num === null || num === undefined) return "--";
  return Number(num).toFixed(decimals);
}

export function formatStatus(status) {
  const statusMap = {
    pending: "待处理",
    processing: "处理中",
    completed: "已完成",
    rejected: "已拒绝",
  };

  return statusMap[status] || status;
}
