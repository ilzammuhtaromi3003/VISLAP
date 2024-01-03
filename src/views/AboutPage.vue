<template lang="">
  <div class="d-flex" style="min-height: 80vh">
    <div class="w-50 mx-16 d-flex flex-column justify-center align-left">
      <div class="text-h4 text-blue-darken-3">
        Kami memahami bahwa laptop Anda adalah alat yang sangat penting dalam
        kehidupan sehari-hari
      </div>
      <div class="text-body-2 my-8">
        Kami hanya menggunakan suku cadang berkualitas tinggi yang dijamin
        memberikan kinerja optimal pada laptop Anda. Pengalaman dan Keahlian Tim
        teknisi kami memiliki pengalaman bertahun-tahun dalam perbaikan laptop.
        Mereka terus menerus mengikuti perkembangan teknologi terbaru untuk
        dapat mengatasi permasalahan apa pun.
      </div>
      <v-btn
        class="text-body-1 mx-auto"
        color="blue-darken-3"
        variant="tonal"
        max-width="150"
        @click="openContact()"
        >Hubungi Kami</v-btn
      >
    </div>
    <div class="w-50 d-flex justify-center">
      <v-img :src="image" max-width="500"></v-img>
    </div>
  </div>
</template>
<script>
import image from "@/assets/about_img.png";
export default {
  data() {
    return {
      image: image,
    };
  },
  methods: {
    openContact() {
      window.open("https://wa.me/6282211302566", "_blank");
    },
  },
};
</script>
<style lang=""></style>
