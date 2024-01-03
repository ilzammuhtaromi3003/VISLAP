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
      <v-window class="w-50" v-model="step">
        <!-- step 1 -->
        <v-window-item :value="1">
          <v-card class="px-6" variant="outlined" color="blue-darken-4">
            <v-card-title>Lupa Password Anda?</v-card-title>
            <v-card-text>Silahkan isi data dibawah ini</v-card-text>
            <v-text-field
              v-model="email"
              label="Email"
              variant="outlined"
              prepend-inner-icon="mdi-account-circle"
              density="compact"
              clearable
            ></v-text-field>
            <v-select
              :items="question"
              v-model="selectedQuestion"
              label="Pilih pertanyaan pemulihan"
              prepend-icon="mdi-help-circle"
            ></v-select>
            <v-text-field
              v-model="answer"
              label="Jawaban"
              variant="outlined"
              prepend-inner-icon="mdi-chat-outline"
              density="compact"
              clearable
            ></v-text-field>
            <v-card-action>
              <v-btn
                class="mb-8 text-body-2"
                variant="flat"
                color="blue-darken-4"
                density="comfortable"
                block
                @click="(loading = true), confirmEmailPass()"
                :loading="loading"
                >Pulihkan</v-btn
              >
            </v-card-action>
          </v-card>
        </v-window-item>
        <!-- step 2 -->
        <v-window-item :value="2">
          <v-card class="px-6" variant="outlined" color="blue-darken-4">
            <v-card-text> Masukkan password baru anda </v-card-text>
            <v-text-field
              v-model="password"
              :rules="[rules.required]"
              label="Password"
              variant="outlined"
              prepend-inner-icon="mdi-shield-key"
              :append-inner-icon="showpass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showpass ? 'text' : 'password'"
              @click:append-inner="showpass = !showpass"
              density="compact"
            ></v-text-field>
            <v-text-field
              v-model="con_password"
              :rules="[rules.required]"
              label="Confirm Password"
              variant="outlined"
              prepend-inner-icon="mdi-shield-key"
              :append-inner-icon="showcon ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showcon ? 'text' : 'password'"
              @click:append-inner="showcon = !showcon"
              density="compact"
            ></v-text-field>
            <v-card-action>
              <v-btn
                class="mb-8 text-body-2"
                variant="flat"
                color="blue-darken-4"
                density="comfortable"
                block
                @click="(loading = true), changePass()"
                :loading="loading"
                >Ubah</v-btn
              >
            </v-card-action>
          </v-card>
        </v-window-item>
      </v-window>
      <div class="text-body-2 mt-2">
        Sudah punya akun?
        <router-link class="text-decoration-none text-blue-darken-3" to="/login"
          >Login</router-link
        >
      </div>
    </v-col>
  </v-row>
</template>
<script>
import sideImage from "@/assets/login_img.png";
import question from "@/assets/question.json";

import { useAuthStore } from "@/store/useAuthStore";
import { useEnvStore } from "@/store/useEnvStore";
import axios from "axios";
import { load } from "webfontloader";
export default {
  data() {
    return {
      showpass: false,
      showcon: false,
      loading: false,
      sideImage: sideImage,
      step: 1,
      question: question,
      email: null,
      selectedQuestion: null,
      answer: null,
      password: null,
      con_password: null,
      reset_token: null,
      rules: {
        required: (value) => !!value || "Wajib diisi.",
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
      },
      Toast: this.$swal.mixin({
        position: "center",
        background: "#F5F5F5",
      }),
    };
  },
  methods: {
    async confirmEmailPass() {
      try {
        const conf = await axios.post(useEnvStore().apiUrl + "users/reset", {
          email: this.email,
          reset_question: this.selectedQuestion,
          reset_answer: this.answer,
        });
        console.log(conf);
        this.reset_token = conf.data.resetToken;
        this.loading = false;
        this.step = this.step + 1;
      } catch (err) {
        switch (err.response.status) {
          case 404:
            this.Toast.fire({
              title: "Error!",
              text: "Pengguna dengan email tersebut tidak ditemukan.",
              icon: "error",
              iconColor: "#C62828",
              color: "#757575",
              showConfirmButton: true,
              timerProgressBar: false,
            });
            this.loading = false;
            break;
          case 400:
            this.Toast.fire({
              title: "Error!",
              text: "Periksa kembali pertanyaan dan jawaban anda.",
              icon: "error",
              iconColor: "#C62828",
              color: "#757575",
              showConfirmButton: true,
              timerProgressBar: false,
            });
            this.loading = false;
            break;
          default:
            this.Toast.fire({
              title: "Error!",
              text: "Terjadi masalah.",
              icon: "error",
              iconColor: "#C62828",
              color: "#757575",
              showConfirmButton: true,
              timerProgressBar: false,
            });
            this.loading = false;
            break;
        }
      }
    },
    async changePass() {
      try {
        const cpass = await axios.put(
          useEnvStore().apiUrl + "users/reset",
          {
            new_password: this.password,
            confirm_newPassword: this.con_password,
          },
          {
            headers: {
              Authorization: "Bearer " + this.reset_token,
            },
          }
        );
        this.loading = false;
        this.Toast.fire({
          title: "Berhasil!",
          text: "Silahkan login menggunakan akun anda.",
          icon: "success",
          iconColor: "#2E7D32",
          color: "#757575",
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            this.$router.push("/login");
          }
        });
      } catch (err) {
        this.Toast.fire({
          title: "Error!",
          text: "Gagal mengganti password.",
          icon: "error",
          iconColor: "#C62828",
          color: "#757575",
          showConfirmButton: true,
          timerProgressBar: false,
        }).then((res) => {
          this.step = 1;
          this.loading = false;
        });
      }
    },
  },
};
</script>
<style lang=""></style>
