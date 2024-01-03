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
  <div v-else style="min-height: 80vh">
    <div>
      <v-container>
        <v-btn
          class="mb-2"
          color="blue-darken-3"
          prepend-icon="mdi-arrow-left"
          @click="this.$router.push('/transaction')"
          variant="plain"
          >Back</v-btn
        >
        <v-card>
          <v-card-title class="text-blue-darken-3"
            >Transaction Details</v-card-title
          >
          <div class="d-flex flex-row mb-4">
            <v-card class="w-50 mx-2 px-4 pb-4">
              <v-card-text class="font-weight-bold">
                Status: {{ getStatus(txDetail.status_id) }}
              </v-card-text>
              <v-card
                class="ma-4"
                v-for="items in txDetail.items"
                :key="items.id"
              >
                <v-card-text class="font-weight-bold">{{
                  items.product_name
                }}</v-card-text>
                <v-row class="ml-2">
                  <v-col> Quantity </v-col>
                  <v-col> Price </v-col>
                  <v-col> Total </v-col>
                </v-row>
                <v-row class="mt-n4 ml-2">
                  <v-col>
                    {{ items.quantity }}
                  </v-col>
                  <v-col>
                    {{ formatCurrency(items.price) }}
                  </v-col>
                  <v-col>
                    {{ formatCurrency(items.total_price) }}
                  </v-col>
                </v-row>
              </v-card>
              <v-card class="mx-4">
                <v-card-text class="font-weight-bold">
                  Final Price: {{ formatCurrency(txDetail.final_price) }}
                </v-card-text>
              </v-card>
            </v-card>
            <v-card class="w-50 mx-2 px-4" max-height="220">
              <v-card-title> Alamat Pengiriman </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="2">Nama</v-col>
                  <v-col cols="auto" class="px-0 mr-1">:</v-col>
                  <v-col>{{ txDetail.user.name }}</v-col>
                </v-row>
                <v-row>
                  <v-col cols="2"> Alamat </v-col>
                  <v-col cols="auto" class="px-0 mr-1"> : </v-col>
                  <v-col
                    >{{ txDetail.alamat }}
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="2" class="px-0 mr-2"></v-col>
                  <v-col class="pa-0 ml-3">{{ txDetail.user.kode_pos }}</v-col>
                </v-row>
                <v-row
                  v-if="txDetail.status_id === 3 || txDetail.status_id === 4"
                >
                  <v-col cols="2"> No. Resi </v-col>
                  <v-col cols="auto" class="px-0 mr-1"> : </v-col>
                  <v-col>{{ txDetail.resi }}</v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </div>
          <div v-if="txDetail.status_id === 1">
            <v-btn
              color="blue-darken-3"
              block
              :loading="loadingButton"
              @click="(loadingButton = true), toPayment()"
              >Lakukan Pembayaran</v-btn
            >
          </div>
          <div v-if="txDetail.status_id === 3">
            <v-btn
              color="green-darken-3"
              prepend-icon="mdi-archive"
              block
              :loading="loadingButton"
              @click="(loadingButton = true), toConfirm()"
              >Konfirmasi Barang Diterima</v-btn
            >
          </div>
          <v-card-title class="text-center">Status Transaksi</v-card-title>
          <v-card-text>
            <v-timeline class="mb-4" direction="horizontal">
              <v-timeline-item
                v-for="list in transStatus"
                :key="list.index"
                :dot-color="getStatusColor(list.id)"
                size="small"
              >
                {{ list.status }}
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-container>
    </div>
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
      loadingButton: false,
      txDetail: [],
      transStatus: [
        { id: 5, status: "Dibatalkan" },
        { id: 6, status: "Refund" },
        { id: 1, status: "Menunggu Pembayaran" },
        { id: 2, status: "Pembayaran Diterima" },
        { id: 3, status: "Barang Dikirim" },
        { id: 4, status: "Transaksi Selesai" },
      ],
      Toast: this.$swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
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
    async getTxDetail() {
      try {
        const txDetail = await axios.get(
          useEnvStore().apiUrl + "txs/" + this.$route.params.id,
          {
            headers: {
              Authorization: "Bearer " + useAuthStore().accessToken,
            },
          }
        );
        this.txDetail = txDetail.data;
        console.log(this.txDetail);
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
    toConfirm() {
      try {
        const accept = axios.put(
          useEnvStore().apiUrl + "txs/" + this.txDetail.id,
          {
            status_id: 4,
          },
          {
            headers: {
              Authorization: "Bearer " + useAuthStore().accessToken,
            },
          }
        );
        this.Toast.fire({
          text: "Pesanan selesai",
          icon: "success",
          iconColor: "#FAFAFA",
          color: "#FAFAFA",
          background: "#1565C0",
        });
        this.loadingButton = false;
        this.getTxDetail();
      } catch (err) {
        console.log(err);
      }
    },
    toPayment() {
      window.snap.pay(this.txDetail.payment_token, {
        onSuccess: () => {
          this.loadingButton = false;
          this.Toast.fire({
            text: "Pembayaran berhasil",
            icon: "success",
            iconColor: "#FAFAFA",
            color: "#FAFAFA",
            background: "#1565C0",
          });
          this.getTxDetail();
        },
        onError: () => {
          this.loadingButton = false;
          this.Toast.fire({
            text: "Pembayaran gagal",
            icon: "error",
            iconColor: "#FAFAFA",
            color: "#FAFAFA",
            background: "#E57373",
          });
          this.getTxDetail();
        },
        onClose: () => {
          this.loadingButton = false;
          this.Toast.fire({
            text: "Pembayaran dibatalkan",
            icon: "error",
            iconColor: "#FAFAFA",
            color: "#FAFAFA",
            background: "#E57373",
          });
        },
      });
    },
    getStatus(status) {
      console.log(status);
      switch (status) {
        case (status = 1):
          return "Menunggu Pembayaran";
        case (status = 2):
          return "Pesanan Diproses";
        case (status = 3):
          return "Menunggu Pengiriman";
        case (status = 4):
          return "Selesai";
        case (status = 5):
          return "Dibatalkan";
      }
    },
    getStatusColor(listId) {
      if (listId === this.txDetail.status_id) {
        if (this.txDetail.status_id === 5 || this.txDetail.status_id === 6) {
          return "red";
        } else {
          return "green";
        }
      } else {
        return "grey";
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(value);
    },
  },
  mounted() {
    let snapMidtrans = document.createElement("script");
    snapMidtrans.setAttribute(
      "src",
      "https://app.sandbox.midtrans.com/snap/snap.js"
    );
    snapMidtrans.setAttribute(
      "data-client-key",
      "SB-Mid-client-lxNB99oD9QYJQZ5U"
    );
    document.head.appendChild(snapMidtrans);
    this.getTxDetail();
  },
};
</script>
<style lang=""></style>
