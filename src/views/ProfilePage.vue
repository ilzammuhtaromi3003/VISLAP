<template lang="">
  <div class="h-screen mx-auto text-center" v-if="loading">
    <v-progress-circular
      class="mt-16"
      :size="128"
      :width="12"
      color="blue-darken-3"
      indeterminate
    ></v-progress-circular>
  </div>
  <div v-else class="w-75 mx-auto mt-8" style="min-height: 80vh">
    <v-btn
      class="mb-4 text-body-2"
      variant="plain"
      prepend-icon="mdi-arrow-left"
      color="blue-darken-3"
      @click="this.$router.push('/')"
      >Kembali</v-btn
    >
    <v-sheet class="sheet" border rounded>
      <v-card-title class="text-black">Your Profile</v-card-title>
      <div class="d-flex">
        <v-text-field
          class="mx-4 w-50"
          density="compact"
          v-model="email"
          label="Email"
          variant="outlined"
          readonly
        ></v-text-field>
        <v-text-field
          class="mx-4 w-50"
          density="compact"
          v-model="name"
          label="Name"
          variant="outlined"
        ></v-text-field>
      </div>
      <v-text-field
        class="mx-4"
        density="compact"
        v-model="alamat"
        label="Address"
        variant="outlined"
      ></v-text-field>
      <div class="d-flex">
        <v-select
          class="mx-4 w-25"
          :items="provinsiList"
          item-title="name"
          v-model="provinsi"
          label="Province"
          variant="outlined"
          density="compact"
          return-object
          @update:modelValue="getCityData()"
        ></v-select>
        <v-select
          class="mx-4 w-25"
          :items="kotaList"
          item-title="name"
          v-model="kota"
          label="City"
          variant="outlined"
          density="compact"
          return-object
          @update:modelValue="getDistrictData()"
        ></v-select>
        <v-select
          class="mx-4 w-25"
          :items="kecamatanList"
          item-title="name"
          v-model="kecamatan"
          label="District"
          variant="outlined"
          density="compact"
          return-object
          @update:modelValue="setDistrictData()"
        ></v-select>
      </div>
      <v-text-field
        class="mx-4 w-25"
        density="compact"
        type="number"
        v-model.number="kode_pos"
        label="Postal Code"
        variant="outlined"
      ></v-text-field>
      <v-btn
        class="text-body-1"
        location="center"
        color="green-darken-3"
        prepend-icon="mdi-content-save"
        :loading="updateLoading"
        @click="updateProfile(), (updateLoading = true)"
        >Simpan</v-btn
      >
    </v-sheet>
  </div>
</template>
<script>
import axios from "axios";

import { useAuthStore } from "@/store/useAuthStore";
import { useEnvStore } from "@/store/useEnvStore";
export default {
  data() {
    return {
      loading: true,
      updateLoading: false,
      email: null,
      name: null,
      alamat: null,
      kecamatan: null,
      kota: null,
      provinsi: null,
      kode_pos: null,
      kecamatanList: [],
      kotaList: [],
      provinsiList: [],
      Toast: this.$swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        iconColor: "#ffffff",
        color: "#ffffff",
        background: "#2E7D32",
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", this.$swal.stopTimer);
          toast.addEventListener("mouseleave", this.$swal.resumeTimer);
        },
      }),
    };
  },
  methods: {
    async getUserInfo() {
      try {
        const user = await axios.get(useEnvStore().apiUrl + "users/profile", {
          headers: {
            Authorization: "Bearer " + useAuthStore().accessToken,
          },
        });
        console.log(user);
        (this.email = user.data.email),
          (this.name = user.data.name),
          (this.alamat = user.data.alamat),
          (this.kecamatan = user.data.kecamatan),
          (this.kota = user.data.kota),
          (this.provinsi = user.data.provinsi);
        this.kode_pos = user.data.kode_pos;
        this.loading = false;
      } catch (err) {
        console.log(err);
        if (err.response.status === 403) {
          this.$router.push("/login");
        }
      }
    },
    getProvinceData() {
      axios
        .get(useEnvStore().addressUrl + "provinces.json")
        .then((res) => {
          this.provinsiList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getCityData() {
      axios
        .get(
          useEnvStore().addressUrl + "regencies/" + this.provinsi.id + ".json"
        )
        .then((res) => {
          this.kotaList = res.data;
          this.provinsi = this.provinsi.name;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getDistrictData() {
      axios
        .get(useEnvStore().addressUrl + "districts/" + this.kota.id + ".json")
        .then((res) => {
          this.kecamatanList = res.data;
          this.kota = this.kota.name;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setDistrictData() {
      this.kecamatan = this.kecamatan.name;
    },
    async updateProfile() {
      try {
        const update = await axios.put(
          useEnvStore().apiUrl + "users/profile/" + useAuthStore().user_id,
          {
            name: this.name,
            alamat: this.alamat,
            provinsi: this.provinsi,
            kota: this.kota,
            kecamatan: this.kecamatan,
            kode_pos: this.kode_pos,
          },
          {
            headers: {
              Authorization: "Bearer " + useAuthStore().accessToken,
            },
          }
        );
        console.log(update);
        this.updateLoading = false;
        this.Toast.fire({
          icon: "success",
          text: "Berhasil diubah!",
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    this.getUserInfo();
    this.getProvinceData();
  },
};
</script>
<style lang="scss">
@use "../styles/settings.scss";
.sheet {
  border-color: settings.$sheet-border-color;
  border-width: settings.$sheet-border-width;
}
</style>
