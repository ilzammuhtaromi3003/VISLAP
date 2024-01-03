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
        <v-card-text>Silahkan lakukan pendaftaran akun anda</v-card-text>
        <v-text-field
          v-model="name"
          :rules="[rules.required]"
          label="Nama"
          variant="outlined"
          prepend-inner-icon="mdi-account-circle"
          density="compact"
          clearable
        ></v-text-field>
        <v-text-field
          v-model="email"
          :rules="[rules.required, rules.email]"
          label="Email"
          variant="outlined"
          prepend-inner-icon="mdi-account-circle"
          density="compact"
          clearable
        ></v-text-field>
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
          @keyup.enter="onRegist(), (loading = true)"
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
          @keyup.enter="onRegist(), (loading = true)"
        ></v-text-field>
        <div class="d-flex align-center">
          <v-select
            :items="question"
            v-model="selectedQuestion"
            label="Pilih pertanyaan pemulihan"
          >
          </v-select>
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props" color="red-darken-1"
                >mdi-help-circle</v-icon
              >
            </template>
            <span>
              Harap ingat pertanyaan dan jawaban anda, digunakan untuk melakukan
              lupa password
            </span>
          </v-tooltip>
        </div>
        <v-text-field
          v-model="answer"
          label="Jawaban"
          variant="outlined"
          prepend-inner-icon="mdi-chat-outline"
          density="compact"
          clearable
        ></v-text-field>
        <VueRecaptcha
          class="w-full mb-4"
          :sitekey="siteKey"
          :load-recaptcha-script="true"
          @verify="handleCaptchaSuccess"
          @error="handleCaptchaFailed"
        >
        </VueRecaptcha>
        <span v-if="showVerificationError" class="text-caption text-red"
          >verification failed</span
        >
        <v-card-action>
          <v-btn
            class="mb-4 text-body-2"
            variant="flat"
            color="blue-darken-4"
            density="comfortable"
            block
            @click="onRegist(), (loading = true)"
            :loading="loading"
            >Register</v-btn
          >
        </v-card-action>
      </v-card>
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

import { VueRecaptcha } from "vue-recaptcha";

import { useEnvStore } from "@/store/useEnvStore";
import axios from "axios";
export default {
  components: { VueRecaptcha },
  data() {
    return {
      tooltip: false,
      showpass: false,
      showcon: false,
      sideImage: sideImage,
      name: null,
      email: null,
      password: null,
      con_password: null,
      question: question,
      selectedQuestion: null,
      answer: null,
      loading: false,
      verifiedCaptcha: false,
      showVerificationError: false,
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
  computed: {
    siteKey() {
      return "6LdUl_0oAAAAALJQpk4vq1NqMvl_C3Q8avk1JGZ9";
    },
  },
  methods: {
    handleCaptchaSuccess() {
      this.verifiedCaptcha = true;
      console.log(this.verifiedCaptcha);
      this.loading = false;
      this.showVerificationError = false;
    },
    handleCaptchaFailed() {
      this.verifiedCaptcha = false;
      console.log(this.verifiedCaptcha);
    },
    async onRegist() {
      if (this.verifiedCaptcha) {
        try {
          const regist = await axios.post(
            useEnvStore().apiUrl + "users/registers",
            {
              name: this.name,
              email: this.email,
              password: this.password,
              confirm_password: this.con_password,
              reset_question: this.selectedQuestion,
              reset_answer: this.answer,
            }
          );
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
          console.log(err);
          if (err.response.status === 409) {
            this.Toast.fire({
              title: "Error!",
              text: "Email sudah digunakan.",
              icon: "error",
              iconColor: "#C62828",
              color: "#757575",
              showConfirmButton: true,
              timerProgressBar: false,
            });
          } else {
            this.Toast.fire({
              title: "Error!",
              text: "Registrasi gagal, periksa kembali data anda.",
              icon: "error",
              iconColor: "#C62828",
              color: "#757575",
              showConfirmButton: true,
              timerProgressBar: false,
            });
          }
          this.loading = false;
        }
      } else {
        this.showVerificationError = true;
        this.loading = false;
      }
    },
  },
};
</script>
