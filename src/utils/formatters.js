// src/utils/formatters.js
/**
 * 格式化工具函数集合
 * 提供日期、数字、状态等格式化函数
 */

/**
 * 格式化日期
 * @param {Date|string|number} date 需要格式化的日期
 * @param {string} format 格式化模式，默认为'YYYY-MM-DD'
 * @returns {string} 格式化后的日期字符串
 *
 * 支持的格式化标记:
 * - YYYY: 四位年份
 * - MM: 两位月份
 * - DD: 两位日期
 * - HH: 两位小时(24小时制)
 * - mm: 两位分钟
 * - ss: 两位秒数
 */
export function formatDate(date, format = "YYYY-MM-DD") {
  if (!date) return "";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

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

/**
 * 格式化数字
 * @param {number} num 需要格式化的数字
 * @param {number} decimals 小数位数，默认为2
 * @returns {string} 格式化后的数字字符串
 */
export function formatNumber(num, decimals = 2) {
  if (num === null || num === undefined) return "--";
  return Number(num).toFixed(decimals);
}

/**
 * 格式化百分比
 * @param {number} num 需要格式化的数字(0-1之间)
 * @param {number} decimals 小数位数，默认为2
 * @returns {string} 格式化后的百分比字符串
 */
export function formatPercent(num, decimals = 2) {
  if (num === null || num === undefined) return "--";
  return (Number(num) * 100).toFixed(decimals) + "%";
}

/**
 * 格式化文件大小
 * @param {number} bytes 文件大小（字节）
 * @param {number} decimals 小数位数，默认为2
 * @returns {string} 格式化后的文件大小
 */
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
  );
}

/**
 * 格式化金额
 * @param {number} amount 金额
 * @param {number} decimals 小数位数，默认为2
 * @param {string} currency 货币符号，默认为¥
 * @returns {string} 格式化后的金额
 */
export function formatCurrency(amount, decimals = 2, currency = "¥") {
  if (amount === null || amount === undefined) return "--";

  const options = {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  };

  return currency + new Intl.NumberFormat("zh-CN", options).format(amount);
}

/**
 * 格式化手机号码（中国大陆）
 * @param {string} mobile 需要格式化的手机号码
 * @returns {string} 格式化后的手机号码（如：188****8888）
 */
export function formatMobile(mobile) {
  if (!mobile || mobile.length !== 11) return mobile;
  return mobile.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
}

/**
 * 格式化身份证号（中国大陆）
 * @param {string} idCard 需要格式化的身份证号
 * @returns {string} 格式化后的身份证号（中间8位隐藏）
 */
export function formatIdCard(idCard) {
  if (!idCard) return idCard;
  return idCard.replace(/^(.{6})(?:\d+)(.{4})$/, "$1********$2");
}

/**
 * 格式化状态
 * @param {string} status 状态标识
 * @returns {string} 格式化后的状态文本
 */
export function formatStatus(status) {
  const statusMap = {
    pending: "待处理",
    in_progress: "处理中",
    resolved: "已解决",
    closed: "已关闭",
    rejected: "已拒绝",
  };

  return statusMap[status] || status;
}

/**
 * 格式化提案类型
 * @param {string} type 类型标识
 * @returns {string} 格式化后的类型文本
 */
export function formatProposalType(type) {
  const typeMap = {
    defect: "缺陷处理",
    improvement: "改进建议",
    new_feature: "新功能需求",
    process: "流程优化",
    other: "其他",
  };

  return typeMap[type] || type;
}

/**
 * 格式化优先级
 * @param {string} priority 优先级标识
 * @returns {string} 格式化后的优先级文本
 */
export function formatPriority(priority) {
  const priorityMap = {
    low: "低",
    medium: "中",
    high: "高",
    urgent: "紧急",
  };

  return priorityMap[priority] || priority;
}

/**
 * 格式化时间范围为友好字符串
 * @param {number} seconds 秒数
 * @returns {string} 格式化后的时间范围
 */
export function formatTimeSpan(seconds) {
  if (seconds < 60) {
    return `${seconds}秒`;
  }

  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}分钟`;
  }

  if (seconds < 86400) {
    return `${Math.floor(seconds / 3600)}小时`;
  }

  return `${Math.floor(seconds / 86400)}天`;
}

/**
 * 格式化列表为逗号分隔的字符串
 * @param {Array} list 列表
 * @param {string} field 需要提取的字段（如果列表元素是对象）
 * @returns {string} 格式化后的字符串
 */
export function formatList(list, field = null) {
  if (!list || !Array.isArray(list) || list.length === 0) {
    return "";
  }

  if (field) {
    return list.map((item) => item[field]).join(", ");
  }

  return list.join(", ");
}

/**
 * 从日期获取中文星期
 * @param {Date|string|number} date 日期
 * @returns {string} 中文星期
 */
export function getChineseWeekday(date) {
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const d = new Date(date);
  return "星期" + weekdays[d.getDay()];
}

export default {
  formatDate,
  formatNumber,
  formatPercent,
  formatFileSize,
  formatCurrency,
  formatMobile,
  formatIdCard,
  formatStatus,
  formatProposalType,
  formatPriority,
  formatTimeSpan,
  formatList,
  getChineseWeekday,
};
