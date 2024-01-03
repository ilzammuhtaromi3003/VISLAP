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
  <div v-else class="d-flex flex-row">
    <v-container class="w-25 pl-8">
      <v-sheet class="h-screen sheet" border rounded>
        <v-card-title class="text-body-2 font-weight-bold mt-16 mb-8"
          >Category:</v-card-title
        >
        <v-checkbox
          v-for="item in category"
          class="ml-3 mt-n8"
          :key="item.index"
          v-model="catCheck"
          :label="item.name"
          :value="item.name"
          color="blue-darken-3"
          density="compact"
        ></v-checkbox>
      </v-sheet>
    </v-container>
    <v-container class="w-75">
      <div class="text-center text-h5">Spare Parts</div>
      <v-row class="mt-8">
        <v-col v-for="items in filteredItems" :key="items.id" cols="3">
          <v-card height="320">
            <v-card-text>
              <v-img
                class="mx-auto"
                width="180"
                height="180"
                :src="url + 'images/' + items.photo"
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular
                      color="grey-lighten-4"
                      indeterminate
                    ></v-progress-circular>
                  </div>
                </template>
              </v-img>
            </v-card-text>
            <v-card-text
              class="text-left mx-4 mt-n4 text-body-2 font-weight-bold"
              >{{ formatCurrency(items.harga) }}</v-card-text
            >
            <v-card-text class="mx-4 mt-n8 text-body-2">{{
              items.nama
            }}</v-card-text>
            <v-card-text
              v-if="items.stock === 0"
              class="text-red text-left mx-4 mt-n4 text-body-2 font-weight-bold"
            >
              Stock habis!
            </v-card-text>
            <div class="text-right mr-4 mb-2">
              <div v-if="items.stock === 0">
                <v-btn
                  color="blue-darken-3"
                  icon="mdi-cart-arrow-down"
                  location="right bottom"
                  position="absolute"
                  variant="text"
                  disabled
                >
                </v-btn>
              </div>
              <div v-else>
                <v-menu :close-on-content-click="false">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      color="blue-darken-3"
                      icon="mdi-cart-arrow-down"
                      location="right bottom"
                      position="absolute"
                      variant="text"
                      v-bind="props"
                      @click="
                        (count = 1),
                          (itemId = items.id),
                          (itemPrice = items.harga),
                          (added = false)
                      "
                    >
                    </v-btn>
                  </template>
                  <v-card>
                    <div class="mt-2 d-flex flex-row align-center">
                      <v-btn
                        icon="mdi-minus-circle"
                        variant="plain"
                        color="blue-darken-3"
                        @click="minusCount()"
                      ></v-btn>
                      <v-card-text class="text-center">{{ count }}</v-card-text>
                      <v-btn
                        icon="mdi-plus-circle"
                        variant="plain"
                        color="blue-darken-3"
                        @click="plusCount()"
                      ></v-btn>
                    </div>
                    <v-card-actions class="mt-n4">
                      <v-btn
                        v-if="!added"
                        class="caption mx-auto"
                        color="blue-darken-3"
                        size="small"
                        icon="mdi-cart-plus"
                        variant="plain"
                        @click="addToCart(), (cartLoading = true)"
                        :loading="cartLoading"
                      ></v-btn>
                      <v-icon
                        v-else
                        class="caption mx-auto"
                        color="green darken-3"
                        size="small"
                        >mdi-check-circle</v-icon
                      >
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import axios from "axios";

import { useEnvStore } from "@/store/useEnvStore";
import { useAuthStore } from "@/store/useAuthStore";
export default {
  data() {
    return {
      category: [],
      catCheck: [],
      products: [],
      count: 1,
      itemId: null,
      itemPrice: null,
      added: false,
      cartLoading: false,
      loading: true,
      url: useEnvStore().apiUrl,
    };
  },
  computed: {
    filteredItems() {
      if (this.catCheck.length === 0) {
        return this.products;
      } else {
        return this.products.filter((item) => {
          return this.catCheck.includes(item.kategori);
        });
      }
    },
  },
  methods: {
    async getCategory() {
      try {
        const cat = await axios.get(useEnvStore().apiUrl + "category");
        // console.log(cat)
        this.category = cat.data;
      } catch (err) {
        console.log(err);
      }
    },
    async getItems() {
      try {
        const prod = await axios.get(useEnvStore().apiUrl + "products");
        console.log(prod);
        this.products = prod.data;
      } catch (err) {
        console.log(err);
      }
    },
    minusCount() {
      if (this.count > 1) {
        this.count = this.count - 1;
      } else {
      }
    },
    plusCount() {
      this.count = this.count + 1;
    },
    async addToCart() {
      if (useAuthStore().isLoggedIn === false) {
        this.$router.push("/login");
      } else {
        const accessToken = useAuthStore().accessToken;
        try {
          const submitCart = await axios.post(
            useEnvStore().apiUrl + "cart",
            {
              id_barang: this.itemId,
              quantity: this.count,
              price: this.itemPrice,
            },
            {
              headers: {
                Authorization: "Bearer " + accessToken,
              },
            }
          );
          this.added = true;
          useAuthStore().getCartValue();
          this.cartLoading = false;
        } catch (err) {
          console.log(err);
        }
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumSignificantDigits: 3,
      }).format(value);
    },
  },
  async mounted() {
    try {
      await this.getCategory();
      await this.getItems();
    } finally {
      this.loading = false;
    }
  },
};
</script>
<style lang="scss">
@use "../styles/settings.scss";
.sheet {
  border-color: settings.$sheet-border-color;
  border-width: 3px;
}
</style>
