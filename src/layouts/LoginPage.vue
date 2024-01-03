<template lang="">
  <v-row class="ma-0">
    <v-col class="h-screen pa-0">
      <v-img :src="sideImage" cover>
        <div
          class="h-screen d-flex flex-column justify-center align-center text-white"
        >
          <div class="title-font" style="font-size: 60px">Vislap</div>
          <div class="text-body-1">Your Notebook Solution</div>
        </div>
      </v-img>
    </v-col>
    <v-col class="d-flex flex-column align-center justify-center">
      <v-card class="w-50 px-6" variant="outlined" color="blue-darken-4">
        <v-card-title>Welcome!</v-card-title>
        <v-card-text>Silahkan login dengan akun anda</v-card-text>
        <v-text-field
          v-model="email"
          label="Email"
          variant="outlined"
          prepend-inner-icon="mdi-account-circle"
          density="compact"
          clearable
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="Password"
          variant="outlined"
          prepend-inner-icon="mdi-shield-key"
          :append-inner-icon="showpass ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showpass ? 'text' : 'password'"
          @click:append-inner="showpass = !showpass"
          density="compact"
          @keyup.enter="onLogin(), (loading = true)"
        ></v-text-field>
        <v-card-action>
          <v-btn
            class="mb-8 text-body-2"
            variant="flat"
            color="blue-darken-4"
            density="comfortable"
            block
            @click="onLogin(), (loading = true)"
            :loading="loading"
            >Login</v-btn
          >
        </v-card-action>
        <div class="text-red mt-n4 mb-4 text-body-2">{{ errormsg }}</div>
      </v-card>
      <div class="text-body-2 mt-2">
        Belum punya akun?
        <router-link
          class="text-decoration-none text-blue-darken-3"
          to="/register"
          >Daftar disini</router-link
        >
      </div>
      <div class="text-body-2 mt-2">
        <router-link
          class="text-decoration-none text-blue-darken-3"
          to="/forget_password"
          >Lupa Password?</router-link
        >
      </div>
    </v-col>
  </v-row>
</template>
<script>
import sideImage from "@/assets/login_img.png";

import { useEnvStore } from "@/store/useEnvStore";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import jwt_decode from "jwt-decode";
export default {
  data() {
    return {
      errormsg: null,
      showpass: false,
      sideImage: sideImage,
      email: null,
      password: null,
      token: null,
      loading: false,
    };
  },
  methods: {
    async onLogin() {
      try {
        const login = await axios.post(useEnvStore().apiUrl + "users/login", {
          email: this.email,
          password: this.password,
        });
        console.log(login);
        useAuthStore().getToken(login.data.access_token);
        // const refreshToken = login.data.refreshToken
        // this.$cookies.set('refreshToken', refreshToken);
        this.decodejwt(login.data.access_token);
        this.loading = false;
        // this.aquireToken() //enable this on production stage
        this.$router.push("/");
      } catch (err) {
        console.log(err);
        this.errormsg = err.response.data.message;
        this.loading = false;
      }
    },
    aquireToken() {
      axios
        .get(useEnvStore().apiUrl + "token", {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    decodejwt(acctoken) {
      const token = acctoken;
      try {
        const decoded = jwt_decode(token);
        console.log(decoded);
        useAuthStore().login(decoded);
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    useAuthStore().logout();
  },
};
</script>
