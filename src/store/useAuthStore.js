import { defineStore } from "pinia";
import { useEnvStore } from "./useEnvStore";

import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: null,
    username: null,
    user_id: null,
    isLoggedIn: false,
    totalCart: 0,
  }),
  actions: {
    getToken(token) {
      this.accessToken = token;
    },
    login(response) {
      (this.isLoggedIn = true), (this.user_id = response.userId);
      this.username = response.name;
    },
    logout() {
      (this.isLoggedIn = false),
        (this.user_id = null),
        (this.username = null),
        (this.accessToken = null);
    },
    getCartValue() {
      axios
        .get(useEnvStore().apiUrl + "cart", {
          headers: {
            Authorization: "Bearer " + useAuthStore().accessToken,
          },
        })
        .then((res) => {
          this.totalCart = Object.keys(res.data).length;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  getters: {
    loginStatus() {
      return this.isLoggedIn;
    },
    getUsername() {
      return this.username;
    },
    getTotalCart(){
      return this.totalCart
    }
  },
  persist: {
    storage: sessionStorage,
  },
});
