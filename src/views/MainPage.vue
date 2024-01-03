<template>
  <div class="d-flex" style="min-height: 85vh">
    <div class="w-50">
      <v-carousel class="h-screen mt-n16" show-arrows="hover" cycle>
        <v-carousel-item
          v-for="item in img"
          :key="item.index"
          :src="item.src"
          cover
        >
        </v-carousel-item>
      </v-carousel>
    </div>
    <div class="w-50 d-flex flex-column">
      <div class="ml-auto mr-4 mt-4">
        <v-img :src="logo" :width="50"></v-img>
      </div>
      <div
        class="d-flex flex-column flex-grow-1 align-left justify-center mx-8"
      >
        <div class="text-h2 font-weight-regular w-75 mb-8 text-blue-darken-3">
          Selamat Datang di VISLAP
        </div>
        <div class="text-body-2 mb-8">
          Tempat Penjualan Sparepart laptop dan Pelayanan Perbaikan Laptop
          Terpercaya, Kami adalah tim profesional yang berkomitmen untuk
          memberikan solusi terbaik untuk semua kebutuhan perbaikan laptop Anda.
          Sejak didirikan, kami telah mendedikasikan diri untuk menjadi mitra
          yang dapat diandalkan bagi individu dan bisnis dalam mengatasi masalah
          teknis laptop mereka.
        </div>
        <div class="d-flex">
          <v-btn
            class="mr-8 text-body-1"
            min-width="125"
            color="blue-darken-3"
            rounded="xl"
            @click="this.$router.push('/shop')"
            >Order</v-btn
          >
          <v-btn
            class="text-body-1"
            color="blue-darken-3"
            variant="outlined"
            min-width="125"
            rounded="xl"
            @click="this.$router.push('/services')"
            >Service</v-btn
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import img1 from "@/assets/home1.jpg";
import img2 from "@/assets/home2.jpg";
import img3 from "@/assets/home3.jpg";
import logo from "@/assets/vislap_logo.png";

import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
export default {
  components: { VSkeletonLoader },
  data() {
    return {
      logo: logo,
      img: [
        {
          src: img1,
        },
        {
          src: img2,
        },
        {
          src: img3,
        },
      ],
      onboarding: 1,
    };
  },
};
</script>

<style></style>
