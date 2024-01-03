<template>
  <div class="h-screen mx-auto text-center" v-if="loading">
    <v-progress-circular
      class="mt-16"
      :size="128"
      :width="12"
      color="blue-darken-3"
      indeterminate
    ></v-progress-circular>
  </div>
  <div v-else style="min-height: 72vh">
    <v-container class="w-75 mx-auto">
      <v-card>
        <v-card-title class="text-blue-darken-3"
          ><v-icon>mdi-cart</v-icon> Cart</v-card-title
        >
        <v-table>
          <thead>
            <tr>
              <th>Product</th>
              <th></th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="list in cartItem" :key="list.index">
              <td>
                <v-img
                  class="my-2"
                  width="90"
                  :src="url + 'images/' + list.barang.photo"
                >
                </v-img>
              </td>
              <td>{{ list.barang.nama }}</td>
              <td>{{ formatCurrency(list.price) }}</td>
              <td>{{ list.quantity }}</td>
              <td>{{ formatCurrency(list.total_price) }}</td>
              <td>
                <v-btn
                  icon="mdi-delete"
                  color="red"
                  variant="plain"
                  size="small"
                  @click="deleteCartItem(list.id)"
                ></v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
      <v-card class="mt-4 ml-auto" width="400">
        <v-card-title class="text-blue-darken-3">Total</v-card-title>
        <v-table>
          <!-- ketika cart kosong -->
          <tbody v-if="Object.keys(cartItem).length === 0">
            <tr>
              <td>Total</td>
              <td>Rp 0</td>
            </tr>
          </tbody>
          <!-- ketika cart memiliki item -->
          <tbody v-else>
            <tr>
              <td>Sub Total</td>
              <td>{{ formatCurrency(totalItemPrice) }}</td>
            </tr>
            <tr>
              <td>Biaya Admin</td>
              <td>{{ formatCurrency(adminFee) }}</td>
            </tr>
            <tr>
              <td>Total</td>
              <td>{{ formatCurrency(grandTotal) }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
      <div class="text-center mt-4 ml-auto" style="width: 400px">
        <v-btn
          class="text-body-1"
          color="blue-darken-3"
          @click="addToTxs()"
          :loading="loadingAdd"
          >Proceed to Payment</v-btn
        >
      </div>
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
      cartItem: [],
      userData: [],
      modifiedItem: [],
      loading: true,
      loadingAdd: false,
      totalItemPrice: 0,
      grandTotal: 0,
      adminFee: parseInt(4000),
      url: useEnvStore().apiUrl,
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
    async getCartData() {
      try {
        const accessToken = useAuthStore().accessToken;
        const cart = await axios.get(useEnvStore().apiUrl + "cart", {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        });
        this.cartItem = cart.data;
        //melakukan map untuk mengambil field yang dibutuhkan
        const newData = this.cartItem.map((item) => {
          return {
            product_name: item.barang.nama,
            price: item.price,
            quantity: item.quantity,
            total_price: item.total_price,
          };
        });
        this.modifiedItem = newData;
        this.loading = false;
        this.subtotals();
      } catch (err) {
        console.log(err);
        if (err.response.status === 403) {
          this.$router.push("/login");
        }
      }
    },
    async getUserData() {
      try {
        const user = await axios.get(useEnvStore().apiUrl + "users/profile", {
          headers: {
            Authorization: "Bearer " + useAuthStore().accessToken,
          },
        });
        console.log(user);
        this.userData = user.data;
      } catch (err) {
        console.log(err);
      }
    },
    async deleteCartItem(itemId) {
      try {
        const accessToken = useAuthStore().accessToken;
        this.loading = true;
        const cart = await axios.delete(
          useEnvStore().apiUrl + "cart/" + itemId,
          {
            headers: {
              Authorization: "Bearer " + accessToken,
            },
          }
        );
        useAuthStore().getCartValue();
        this.getCartData();
      } catch (err) {
        if (err.response.status === 403) {
          this.$router.push("/login");
        }
      }
    },
    async addToTxs() {
      try {
        const accessToken = useAuthStore().accessToken;
        this.loadingAdd = true;
        const txs = await axios.post(
          useEnvStore().apiUrl + "txs/",
          {
            user_id: useAuthStore().user_id,
            items: this.modifiedItem,
            alamat: this.userData.alamat,
            provinsi: this.userData.provinsi,
            kota: this.userData.kota,
            kecamatan: this.userData.kecamatan,
            kode_pos: this.userData.kode_pos,
            final_price: this.grandTotal,
          },
          {
            headers: {
              Authorization: "Bearer " + accessToken,
            },
          }
        );
        console.log(txs);
        axios
          .post(useEnvStore().apiUrl + "payment/process-payment/", txs.data, {
            headers: {
              Authorization: "Bearer " + useAuthStore().accessToken,
            },
          })
          .then((res) => {
            axios
              .put(
                useEnvStore().apiUrl + "txs/" + txs.data.id,
                {
                  status_id: 1,
                  payment_token: res.data.token,
                },
                {
                  headers: {
                    Authorization: "Bearer " + useAuthStore().accessToken,
                  },
                }
              )
              .then((res) => {
                axios
                  .get(useEnvStore().apiUrl + "txs/" + txs.data.id, {
                    headers: {
                      Authorization: "Bearer " + useAuthStore().accessToken,
                    },
                  })
                  .then((result) => {
                    console.log(result);
                    window.snap.pay(result.data.payment_token, {
                      onSuccess: () => {
                        this.Toast.fire({
                          text: "Pembayaran berhasil",
                          icon: "success",
                          iconColor: "#FAFAFA",
                          color: "#FAFAFA",
                          background: "#1565C0",
                        });
                        this.$router.push("/transaction/" + txs.data.id);
                      },
                      onError: () => {
                        this.$router.push("/transaction");
                        this.Toast.fire({
                          text: "Pembayaran gagal",
                          icon: "error",
                          iconColor: "#FAFAFA",
                          color: "#FAFAFA",
                          background: "#E57373",
                        });
                      },
                      onClose: () => {
                        this.$router.push("/transaction/" + txs.data.id);
                        this.Toast.fire({
                          text: "Pembayaran dibatalkan",
                          icon: "error",
                          iconColor: "#FAFAFA",
                          color: "#FAFAFA",
                          background: "#E57373",
                        });
                        this.getCartData();
                      },
                    });
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
        useAuthStore().getCartValue();
      } catch (err) {
        if (err.response.data.message === "stock not enough") {
          this.Toast.fire({
            text: "Stock habis.",
            icon: "error",
            iconColor: "#FAFAFA",
            color: "#FAFAFA",
            background: "#E57373",
          });
          this.loadingAdd = false;
        } else {
          console.log(err);
        }
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(value);
    },
    subtotals() {
      const total_bayar = this.cartItem.reduce(
        (total, obj) => total + obj.total_price,
        0
      );
      this.totalItemPrice = total_bayar;
      this.grandTotal = parseInt(this.totalItemPrice) + parseInt(this.adminFee);
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
    this.getCartData();
    this.getUserData();
  },
};
</script>
<style lang=""></style>
