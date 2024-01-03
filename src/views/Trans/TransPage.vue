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
    <v-container>
      <v-menu
        v-model="dateDialog"
        :close-on-content-click="false"
        location="bottom"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            class="text-body-1 mb-4"
            location="bottom"
            color="blue-darken-3"
            v-bind="props"
            variant="outlined"
            >Filter by Date</v-btn
          >
        </template>
        <div class="d-flex flex-column bg-grey-lighten-4 pa-4">
          <v-col class="mb-4">
            <v-row>Start Date</v-row>
            <v-row>
              <VueDatePicker
                v-model="startDate"
                :month-change-on-scroll="false"
                model-type="yyyy-MM-dd"
              />
            </v-row>
          </v-col>
          <v-col class="mb-4">
            <v-row>End Date</v-row>
            <v-row>
              <VueDatePicker
                v-model="endDate"
                :month-change-on-scroll="false"
                model-type="yyyy-MM-dd"
              />
            </v-row>
          </v-col>
          <div class="d-flex justify-center">
            <v-btn
              class="mr-4"
              color="blue-darken-3"
              :loading="loadingBut"
              @click="(loadingBut = true), getByDate()"
              >Submit</v-btn
            >
            <v-btn
              color="green-darken-3"
              :loading="loadingBut"
              @click="(loadingBut = true), getTxs()"
              >Reset</v-btn
            >
          </div>
        </div>
      </v-menu>
      <v-card class="pa-4">
        <v-card-title class="text-blue-darken-3">Your Transaction</v-card-title>
        <v-card
          v-for="tx in paginatedData"
          :key="tx.id"
          class="mb-2"
          @click="toTxDetail(tx.id)"
        >
          <v-card-title>{{ tx.status.status }}</v-card-title>
          <div class="d-flex flex-row">
            <v-card-text>{{ formattedDate(tx.date) }}</v-card-text>
            <v-card-text class="text-right">{{
              formatCurrency(tx.final_price)
            }}</v-card-text>
          </div>
        </v-card>
        <v-pagination
          class="mt-8"
          :length="totalPages"
          v-model="currentPage"
          color="blue-darken-3"
          variant="text"
        ></v-pagination>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import { useAuthStore } from "@/store/useAuthStore";
import { useEnvStore } from "@/store/useEnvStore";

import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import axios from "axios";
import moment from "moment/min/moment-with-locales";
export default {
  components: {
    VueDatePicker,
  },
  data() {
    return {
      startDate: moment().format("YYYY-MM-D"),
      endDate: moment().format("YYYY-MM-D"),
      dateDialog: false,
      loading: true,
      loadingBut: false,
      txData: [],
      itemsPerPage: 5,
      currentPage: 1,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.txData.length / this.itemsPerPage);
    },
    paginatedData() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      const reversed = this.txData.slice().reverse();
      return reversed.slice(startIndex, endIndex);
    },
  },
  methods: {
    async getTxs() {
      try {
        const accessToken = useAuthStore().accessToken;
        const txs = await axios.get(useEnvStore().apiUrl + "txs", {
          headers: {
            Authorization: "Bearer " + useAuthStore().accessToken,
          },
        });
        console.log(txs);
        this.txData = txs.data;
        this.loading = false;
        this.loadingBut = false;
      } catch (err) {
        console.log(err);
        if (err.response.status === 403) {
          this.$router.push("/login");
        }
      }
    },
    async getByDate() {
      try {
        const getDate = await axios.post(
          useEnvStore().apiUrl + "txs/range",
          {
            start_date: this.startDate,
            end_date: this.endDate,
          },
          {
            headers: {
              Authorization: "Bearer " + useAuthStore().accessToken,
            },
          }
        );
        console.log(getDate);
        this.txData = getDate.data;
        this.loadingBut = false;
      } catch (err) {
        console.log(err);
      }
    },
    toTxDetail(id) {
      this.$router.push("/transaction/" + id);
    },
    formattedDate(value) {
      moment.locale("id");
      return moment(value).format("D MMMM YYYY [Jam] HH:mm:s");
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
    this.getTxs();
  },
};
</script>
<style lang=""></style>
