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
      <v-card>
        <v-card-title class="text-blue-darken-3 mb-4">
          Your Service List
        </v-card-title>
        <v-card
          class="mx-4 mb-4"
          v-for="item in reversedService"
          :key="item.id"
          @click="this.$router.push('/service/' + item.id)"
        >
          <v-row class="ml-2">
            <v-col> Date: </v-col>
            <v-col> Technician: </v-col>
            <v-col> Status: </v-col>
          </v-row>
          <v-row class="mt-n4 ml-2">
            <v-col>
              {{ formattedDate(item.date) }}
            </v-col>
            <v-col>
              {{ item.technician.name }}
            </v-col>
            <v-col>
              {{ item.service_status.status_name }}
            </v-col>
          </v-row>
        </v-card>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment/min/moment-with-locales";

import { useAuthStore } from "@/store/useAuthStore";
import { useEnvStore } from "@/store/useEnvStore";
export default {
  data() {
    return {
      loading: true,
      serviceData: [],
    };
  },
  computed: {
    reversedService() {
      return this.serviceData.slice().reverse();
    },
  },
  methods: {
    async getService() {
      try {
        const serv = await axios.get(useEnvStore().apiUrl + "services/user", {
          headers: {
            Authorization: "Bearer " + useAuthStore().accessToken,
          },
        });
        console.log(serv);
        this.serviceData = serv.data;
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
    formattedDate(value) {
      moment.locale("id");
      return moment(value).format("D MMMM YYYY [Jam] HH:mm:s");
    },
  },
  mounted() {
    this.getService();
  },
};
</script>
<style lang=""></style>
