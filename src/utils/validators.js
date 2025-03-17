// src/utils/validators.js
/**
 * 通用表单验证规则
 * 用于Element Plus表单验证，提供一致的验证逻辑
 */

// 用户名验证：4-16位字母、数字、下划线或连字符
export const validateUsername = (rule, value, callback) => {
    if (!value) {
        callback(new Error("请输入用户名"));
    } else if (!/^[a-zA-Z0-9_-]{4,16}$/.test(value)) {
        callback(new Error("用户名应为4-16位字母、数字、下划线或连字符"));
    } else {
        callback();
    }
};
export const validateDepartment = (rule, value, callback) => {
    if (!value) {
        callback(new Error("请输入部门名称"));
    } else if (!/^[\u4e00-\u9fa5a-zA-Z\s]{2,30}$/.test(value)) {
        callback(new Error("部门名称应为2-30个中文或英文字符，可包含空格"));
    } else {
        callback();
    }
};
export const validateCFTName = (rule, value, callback) => {
    if (!value) {
        callback(new Error("请输入 CFT 名称"));
    } else if (!/^[\u4e00-\u9fa5]{2,10}$/.test(value)) {
        callback(new Error("CFT 名称必须为 2-10 个中文字符"));
    } else {
        callback();
    }
};

// 密码验证：至少6位字符
export const validatePassword = (rule, value, callback) => {
    if (!value) {
        callback(new Error("请输入密码"));
    } else if (value.length < 6) {
        callback(new Error("密码长度不能小于6位"));
    } else {
        callback();
    }
};

// 邮箱格式验证
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

// 手机号码验证：11位数字
export const validateMobile = (rule, value, callback) => {
    const mobileRegex = /^1[3-9]\d{9}$/;
    if (!value) {
        callback(new Error("请输入手机号码"));
    } else if (!mobileRegex.test(value)) {
        callback(new Error("请输入正确的手机号码"));
    } else {
        callback();
    }
};
export const validateEmployeeID = (rule, value, callback) => {
    if (!value) {
        callback(new Error("请输入工号"));
    } else if (!/^\d{4,12}$/.test(value)) {
        callback(new Error("工号应为4-12位数字"));
    } else {
        callback();
    }
};

// URL验证
export const validateURL = (rule, value, callback) => {
    if (!value) {
        callback();
        return;
    }

    try {
        new URL(value);
        callback();
    } catch (error) {
        callback(new Error("请输入正确的URL地址"));
    }
};

// IP地址验证
export const validateIP = (rule, value, callback) => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!value) {
        callback();
        return;
    }

    if (!ipRegex.test(value)) {
        callback(new Error("请输入正确的IP地址"));
        return;
    }

    const parts = value.split(".");
    for (const part of parts) {
        const num = parseInt(part, 10);
        if (num < 0 || num > 255) {
            callback(new Error("IP地址各段应在0-255之间"));
            return;
        }
    }

    callback();
};

// 数字验证
export const validateNumber = (rule, value, callback) => {
    if (value === "" || value === undefined || value === null) {
        callback();
        return;
    }

    if (!Number.isFinite(Number(value))) {
        callback(new Error("请输入数字"));
    } else {
        callback();
    }
};

// 整数验证
export const validateInteger = (rule, value, callback) => {
    if (value === "" || value === undefined || value === null) {
        callback();
        return;
    }

    if (!Number.isInteger(Number(value))) {
        callback(new Error("请输入整数"));
    } else {
        callback();
    }
};

// 正数验证
export const validatePositiveNumber = (rule, value, callback) => {
    if (value === "" || value === undefined || value === null) {
        callback();
        return;
    }

    const num = Number(value);
    if (!Number.isFinite(num)) {
        callback(new Error("请输入数字"));
    } else if (num <= 0) {
        callback(new Error("请输入正数"));
    } else {
        callback();
    }
};

// 非空验证
export const validateRequired = (rule, value, callback) => {
    if (value === "" || value === undefined || value === null) {
        callback(new Error("此项不能为空"));
    } else {
        callback();
    }
};

// 日期验证：确保日期不早于今天
export const validateFutureDate = (rule, value, callback) => {
    if (!value) {
        callback();
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const inputDate = new Date(value);
    inputDate.setHours(0, 0, 0, 0);

    if (inputDate < today) {
        callback(new Error("日期不能早于今天"));
    } else {
        callback();
    }
};

// 文件大小验证（单位：MB）
export const validateFileSize = (maxSize, file) => {
    const isLessThanMax = file.size / 1024 / 1024 < maxSize;
    if (!isLessThanMax) {
        return false;
    }
    return true;
};

// 文件类型验证
export const validateFileType = (types, file) => {
    return types.includes(file.type);
};

// 自定义表单验证规则生成器
export const generateRules = (options) => {
    const rulesObj = {};

    for (const field in options) {
        const fieldRules = [];
        const config = options[field];

        // 必填规则
        if (config.required) {
            fieldRules.push({
                required: true,
                message: config.requiredMessage || `${config.label || field}不能为空`,
                trigger: config.trigger || "blur",
            });
        }

        // 特定验证器
        if (config.validator) {
            fieldRules.push({
                validator: config.validator,
                trigger: config.trigger || "blur",
            });
        }

        // 长度规则
        if (config.min !== undefined || config.max !== undefined) {
            const rule = {
                trigger: config.trigger || "blur",
            };

            if (config.min !== undefined) {
                rule.min = config.min;
            }

            if (config.max !== undefined) {
                rule.max = config.max;
            }

            if (config.min !== undefined && config.max !== undefined) {
                rule.message =
                    config.lengthMessage ||
                    `长度应在${config.min}到${config.max}个字符之间`;
            } else if (config.min !== undefined) {
                rule.message = config.lengthMessage || `不能少于${config.min}个字符`;
            } else {
                rule.message = config.lengthMessage || `不能超过${config.max}个字符`;
            }

            fieldRules.push(rule);
        }

        // 正则表达式验证
        if (config.pattern) {
            fieldRules.push({
                pattern: config.pattern,
                message: config.patternMessage || "格式不正确",
                trigger: config.trigger || "blur",
            });
        }

        rulesObj[field] = fieldRules;
    }

    return rulesObj;
};

/**
 * 常用表单规则集合，可直接应用于Element Plus表单
 */
export const commonRules = {
    // 用户名规则
    username: [
        {required: true, message: "请输入用户名", trigger: "blur"},
        {validator: validateUsername, trigger: "blur"},
    ],

    // 密码规则
    password: [
        {required: true, message: "请输入密码", trigger: "blur"},
        {validator: validatePassword, trigger: "blur"},
    ],

    // 邮箱规则
    email: [
        {required: true, message: "请输入邮箱地址", trigger: "blur"},
        {validator: validateEmail, trigger: "blur"},
    ],

    // 手机号规则
    mobile: [
        {required: true, message: "请输入手机号码", trigger: "blur"},
        {validator: validateMobile, trigger: "blur"},
    ],

    // 必填项规则
    required: [{required: true, message: "此项不能为空", trigger: "blur"}],

    // 数字规则
    number: [{validator: validateNumber, trigger: "blur"}],

    // 正数规则
    positiveNumber: [{validator: validatePositiveNumber, trigger: "blur"}],

    // URL规则
    url: [{validator: validateURL, trigger: "blur"}],
};

export default {
    validateEmployeeID,
    validateUsername,
    validatePassword,
    validateEmail,
    validateMobile,
    validateDepartment,
    validateCFTName,
    validateURL,
    validateIP,
    validateNumber,
    validateInteger,
    validatePositiveNumber,
    validateRequired,
    validateFutureDate,
    validateFileSize,
    validateFileType,
    generateRules,
    commonRules,
};
