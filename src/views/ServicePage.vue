<template lang="">
  <div class="d-flex" style="min-height: 72vh">
    <div class="w-50">
      <v-img class="mx-auto" :src="serviceImg" :width="500"></v-img>
    </div>
    <div class="w-50 ma-4">
      <div class="text-blue-darken-3 text-h3 font-weight-medium">Service</div>
      <div>
        Vislap menyediakan layanan service laptop dengan biaya yang terjangkau,
        teknisi yang berpengalaman, dan kecepatan waktu pengerjaan.
        <br />Anda dapat mengajukan permintaan service dengan memasukkan nomor
        whatsapp dan keluhan anda pada form dibawah.
      </div>
      <div class="mt-4">
        <!-- ketika sudah login -->
        <div v-if="isLoggedIn">
          <v-card class="pa-4">
            <v-card-title class="text-blue-darken-3">
              Ajukan Permintaan Service
            </v-card-title>
            <v-text-field
              v-model="wa"
              type="number"
              variant="outlined"
              color="blue-darken-3"
              label="Masukkan Nomor Whatsapp"
              density="compact"
              :rules="[rules.required]"
            ></v-text-field>
            <v-textarea
              v-model="message"
              variant="outlined"
              color="blue-darken-3"
              label="Tuliskan keluhan anda"
              :rules="[rules.required]"
              clearable
              auto-grow
            ></v-textarea>
            <v-card-actions>
              <v-btn
                class="mx-auto"
                color="blue-darken-3"
                variant="tonal"
                :loading="loading"
                @click="(loading = true), submitService()"
                >Ajukan</v-btn
              >
            </v-card-actions>
            <div class="text-center"></div>
          </v-card>
        </div>
        <!-- ketika sudah belum login -->
        <div v-else>
          <v-card class="pa-4">
            <v-card-title class="text-blue-darken-3">
              Ajukan Permintaan Service
            </v-card-title>
            <v-card-text>Harap melakukan Login terlebih dahulu.</v-card-text>
            <v-card-actions>
              <v-btn
                class="mx-auto"
                color="blue-darken-3"
                variant="tonal"
                :loading="loading"
                @click="this.$router.push('/login')"
                >Login</v-btn
              >
            </v-card-actions>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import serviceImg from "@/assets/service_icon.png";
import axios from "axios";

import { useAuthStore } from "@/store/useAuthStore";
import { useEnvStore } from "@/store/useEnvStore";
export default {
  data() {
    return {
      isLoggedIn: useAuthStore().loginStatus,
      loading: false,
      serviceImg: serviceImg,
      wa: null,
      message: null,
      rules: {
        required: (value) => !!value || "Wajib diisi.",
      },
      Toast: this.$swal.mixin({
        position: "center",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#F5F5F5",
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", this.$swal.stopTimer);
          toast.addEventListener("mouseleave", this.$swal.resumeTimer);
        },
      }),
    };
  },
  methods: {
    async submitService() {
      try {
        const submit = await axios.post(
          useEnvStore().apiUrl + "services",
          {
            wa_user: this.wa,
            message1: this.message,
          },
          {
            headers: {
              Authorization: "Bearer " + useAuthStore().accessToken,
            },
          }
        );
        this.loading = false;
        this.Toast.fire({
          title: "Permintaan Berhasil Dikirimkan!",
          text: "Selanjutnya, teknisi akan menghubungi anda melalui Whatsapp",
          icon: "success",
          iconColor: "#2E7D32",
          color: "#757575",
        });
        this.message = null;
        this.wa = null;
      } catch (err) {
        console.log(err);
        if (err.response.status === 403) {
          this.$router.push("/login");
        } else {
          this.loading = false;
          this.Toast.fire({
            title: "Permintaan Gagal Dikirimkan!",
            text: "Periksa kembali data yang anda isikan.",
            icon: "error",
            iconColor: "#C62828",
            color: "#757575",
          });
        }
      }
    },
  },
};
</script>
<style lang=""></style>
