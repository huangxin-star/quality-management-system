// src/store/user.js
import { defineStore } from "pinia";
import { login, register, getUserInfo, logout } from "@/utils/api";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    userInfo: JSON.parse(localStorage.getItem("userInfo") || "{}"),
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    async loginUser(credentials) {
      try {
        const response = await login(credentials);
        const { token, userInfo } = response.data;

        this.token = token;
        this.userInfo = userInfo;

        localStorage.setItem("token", token);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        return Promise.resolve(response);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async registerUser(userData) {
      try {
        const response = await register(userData);
        return Promise.resolve(response);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async fetchUserInfo() {
      try {
        const response = await getUserInfo();
        this.userInfo = response.data;
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        return Promise.resolve(response);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async logoutUser() {
      try {
        await logout();
        this.token = "";
        this.userInfo = {};
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
      } catch (error) {
        console.error("Logout error:", error);
      }
    },
  },
});

